import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import { extractTextFromPDF, deleteFile } from "../services/pdf.service"
import { analyzeResume } from "../services/ai.service"
import { AnalysisJobStatus } from "../types"

const jobStore = new Map<string, AnalysisJobStatus>()

export const uploadResume = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    res.status(400).json({ error: { message: "No file uploaded. Please upload a PDF file.", code: "NO_FILE" } })
    return
  }

  const jobId = uuidv4()
  const filePath = path.resolve(req.file.path)
  const jobDescription = req.body?.jobDescription as string | undefined

  const job: AnalysisJobStatus = {
    jobId,
    status: "queued",
    progress: 0,
    step: "Queued for processing"
  }
  jobStore.set(jobId, job)

  res.status(202).json({ jobId, message: "Analysis started" })

  ;(async () => {
    try {
      updateJob(jobId, { status: "processing", progress: 10, step: "Extracting text from PDF..." })
      const { text } = await extractTextFromPDF(filePath)

      updateJob(jobId, { progress: 35, step: "Running AI analysis..." })
      const result = await analyzeResume(text, jobDescription, (step) => {
        updateJob(jobId, { progress: 70, step })
      })

      updateJob(jobId, { status: "completed", progress: 100, step: "Done!", result })
      console.log("Job completed:", jobId, "Score:", result.score)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed"
      updateJob(jobId, { status: "failed", progress: 0, step: "Failed", error: message })
      console.error("Job failed:", jobId, message)
    } finally {
      deleteFile(filePath)
    }
  })()
}

export const getJobStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { jobId } = req.params
  const job = jobStore.get(jobId)

  if (!job) {
    res.status(404).json({ error: { message: "Job not found", code: "JOB_NOT_FOUND" } })
    return
  }

  res.json(job)

  if (job.status === "completed" || job.status === "failed") {
    setTimeout(() => jobStore.delete(jobId), 5 * 60 * 1000)
  }
}

function updateJob(jobId: string, patch: Partial<AnalysisJobStatus>): void {
  const existing = jobStore.get(jobId)
  if (existing) jobStore.set(jobId, { ...existing, ...patch })
}
