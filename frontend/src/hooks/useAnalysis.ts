import { useState, useRef, useCallback } from "react"
import { ResumeAnalysis } from "../types"
import { uploadResume, getJobStatus } from "../services/api"

type AnalysisState =
  | { phase: "idle" }
  | { phase: "uploading" }
  | { phase: "polling"; jobId: string; progress: number; step: string }
  | { phase: "done"; result: ResumeAnalysis }
  | { phase: "error"; message: string }

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ phase: "idle" })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const analyze = useCallback(async (file: File, jobDescription?: string) => {
    setState({ phase: "uploading" })
    try {
      const { jobId } = await uploadResume(file, jobDescription)
      setState({ phase: "polling", jobId, progress: 0, step: "Queued..." })

      intervalRef.current = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId)
          if (status.status === "processing" || status.status === "queued") {
            setState({ phase: "polling", jobId, progress: status.progress, step: status.step })
          } else if (status.status === "completed" && status.result) {
            stopPolling()
            sessionStorage.setItem("analysisResult", JSON.stringify(status.result))
            setState({ phase: "done", result: status.result })
          } else if (status.status === "failed") {
            stopPolling()
            setState({ phase: "error", message: status.error || "Analysis failed" })
          }
        } catch {
          stopPolling()
          setState({ phase: "error", message: "Lost connection to server" })
        }
      }, 1500)
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Upload failed" })
    }
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    setState({ phase: "idle" })
  }, [])

  return { state, analyze, reset }
}
