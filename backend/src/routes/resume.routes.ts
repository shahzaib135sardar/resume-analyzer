import { Router } from "express"
import { uploadResume, getJobStatus } from "../controllers/resume.controller"
import { uploadMiddleware } from "../middleware/upload.middleware"

const resumeRouter = Router()

resumeRouter.post("/upload", uploadMiddleware, uploadResume)
resumeRouter.get("/status/:jobId", getJobStatus)

export { resumeRouter }
