import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import { rateLimit } from "express-rate-limit"
import { resumeRouter } from "./routes/resume.routes"
import { authRouter } from "./routes/auth.routes"
import { errorHandler } from "./middleware/errorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({ contentSecurityPolicy: false }))

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})
app.use("/api", limiter)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/resumes", resumeRouter)
app.use("/api/auth", authRouter)

app.use((_req, res) => {
  res.status(404).json({ error: { message: "Route not found", code: "NOT_FOUND" } })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
