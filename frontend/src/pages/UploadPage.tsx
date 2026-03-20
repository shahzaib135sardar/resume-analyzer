import React, { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import { useAnalysis } from "../hooks/useAnalysis"

export default function UploadPage() {
  const navigate = useNavigate()
  const { state, analyze, reset } = useAnalysis()
  const [jd, setJd] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dropError, setDropError] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const clearError = useCallback(() => setDropError(""), [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onDrop = useCallback((files: File[]) => {
    setFile(files[0] || null)
    setDropError("")
  }, [])

  const onDropRejected = useCallback((rejectedFiles) => {
    let message = ""
    for (const file of rejectedFiles) {
      if (file.errors.some(e => e.code === "file-too-large")) {
        message = "File is too large. Maximum size is 10MB."
        break
      } else if (file.errors.some(e => e.code === "file-invalid-type")) {
        message = "Only PDF files are accepted. Please convert your document to PDF first."
        break
      }
    }
    setDropError(message || "File rejected. Please try another file.")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  React.useEffect(() => {
    if (state.phase === "done") {
      navigate("/dashboard")
    }
  }, [state, navigate])

  if (state.phase === "uploading" || state.phase === "polling") {
    const progress = state.phase === "polling" ? state.progress : 5
    const step = state.phase === "polling" ? state.step : "Uploading..."
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: isMobile ? "16px" : "20px", padding: "20px" }}>
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: isMobile ? "40px" : "48px", height: isMobile ? "40px" : "48px", border: "4px solid #1E1E2E", borderTopColor: "#6366F1", borderRadius: "50%", animation: "sp .8s linear infinite" }} />
        <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "600", color: "#F1F5F9" }}>Analyzing your resume...</h2>
        <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#94A3B8" }}>{step}</p>
        <div style={{ width: isMobile ? "250px" : "300px", height: "6px", background: "#1E1E2E", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: progress + "%", background: "#6366F1", borderRadius: "3px", transition: "width 0.5s ease" }} />
        </div>
      </div>
    )
  }

  const containerMaxWidth = isMobile ? "100%" : "660px"
  const paddingTop = isMobile ? "32px" : "56px"
  const paddingLeftRight = isMobile ? "16px" : "24px"
  const paddingBottom = isMobile ? "60px" : "80px"
  const h1FontSize = isMobile ? "28px" : "40px"
  const h1LetterSpacing = isMobile ? "-1px" : "-2px"
  const dropPadding = isMobile ? "32px 20px" : file ? "18px 22px" : "48px 24px"
  const iconFontSize = isMobile ? "36px" : "44px"
  const fileNameFontSize = isMobile ? "13px" : "14px"
  const buttonPadding = isMobile ? "14px 20px" : "16px 24px"
  const buttonFontSize = isMobile ? "15px" : "16px"
  const textareaPadding = isMobile ? "12px 14px" : "14px 16px"

  return (
    <div style={{ maxWidth: containerMaxWidth, margin: "0 auto", padding: `${paddingTop} ${paddingLeftRight} ${paddingBottom}` }}>
      <div style={{ marginBottom: isMobile ? "24px" : "40px" }}>
        <div style={{ fontSize: isMobile ? "10px" : "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#6366F1", marginBottom: isMobile ? "8px" : "12px" }}>AI-Powered Analysis</div>
        <h1 style={{ fontSize: h1FontSize, lineHeight: "1.1", fontWeight: "800", letterSpacing: h1LetterSpacing, color: "#F1F5F9", marginBottom: isMobile ? "12px" : "16px" }}>Analyze Your Resume with AI</h1>
        <p style={{ fontSize: isMobile ? "14px" : "16px", color: "#94A3B8", lineHeight: "1.7" }}>Get instant scoring, skill extraction, job match analysis and personalized improvement suggestions.</p>
      </div>

      <div style={{ background: "#12121A", border: "1px solid #1E1E2E", borderRadius: "16px", padding: isMobile ? "24px" : "32px" }}>
        <div {...getRootProps()} style={{ border: "2px dashed " + (isDragActive ? "#6366F1" : file ? "#2D2D3F" : "#2D2D3F"), borderRadius: "12px", padding: dropPadding, textAlign: "center", cursor: "pointer", background: isDragActive ? "rgba(99,102,241,0.05)" : "#0A0A0F" }}>
          <input {...getInputProps()} />
          {file ? (
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "14px" }}>
              <div style={{ fontSize: isMobile ? "24px" : "28px" }}>📄</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: fileNameFontSize, fontWeight: "500", color: "#F1F5F9" }}>{file.name}</div>
                <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#94A3B8" }}>{Math.round(file.size / 1024)} KB</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); clearError(); }} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: isMobile ? "16px" : "18px" }}>×</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: iconFontSize, marginBottom: isMobile ? "8px" : "12px" }}>📄</div>
              <div style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#F1F5F9", marginBottom: isMobile ? "4px" : "6px" }}>{isDragActive ? "Drop your PDF here" : "Drop your resume here"}</div>
              <div style={{ fontSize: isMobile ? "12px" : "13px", color: "#475569" }}>or click to browse • PDF only • max 10MB</div>
            </div>
          )}
        </div>

        <div style={{ fontSize: isMobile ? "12px" : "13px", color: "#94A3B8", textAlign: "center", marginTop: isMobile ? "6px" : "8px", fontWeight: "500" }}>
          Accepted format: PDF only
        </div>

        {dropError && (
          <div style={{ marginTop: isMobile ? "12px" : "14px", padding: isMobile ? "10px 12px" : "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: isMobile ? "13px" : "14px" }}>
            {dropError}
          </div>
        )}

        {state.phase === "error" && (
          <div style={{ marginTop: isMobile ? "12px" : "14px", padding: isMobile ? "10px 12px" : "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: isMobile ? "13px" : "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span>{state.message}</span>
            <button onClick={reset} style={{ background: "none", border: "1px solid #EF4444", color: "#EF4444", borderRadius: "6px", padding: isMobile ? "6px 12px" : "4px 10px", cursor: "pointer", fontSize: isMobile ? "11px" : "12px" }}>Try Again</button>
          </div>
        )}

        <div style={{ marginTop: isMobile ? "16px" : "22px" }}>
          <label style={{ display: "block", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", color: "#94A3B8", marginBottom: isMobile ? "6px" : "8px" }}>Job Description <span style={{ fontWeight: "400", color: "#475569" }}>(optional)</span></label>
          <textarea 
            value={jd} 
            onChange={(e) => setJd(e.target.value)} 
            placeholder="Paste job description here to see match percentage..." 
            rows={isMobile ? 3 : 4} 
            style={{ 
              width: "100%", 
              padding: textareaPadding, 
              border: "1px solid #1E1E2E", 
              borderRadius: "10px", 
              background: "#0A0A0F", 
              fontFamily: "inherit", 
              fontSize: isMobile ? "13px" : "14px", 
              color: "#F1F5F9", 
              resize: "vertical", 
              outline: "none" 
            }} 
          />
        </div>

        <button 
          onClick={() => file && analyze(file, jd)} 
          disabled={!file} 
          style={{ 
            width: "100%", 
            marginTop: isMobile ? "16px" : "20px", 
            padding: buttonPadding, 
            background: file ? "#6366F1" : "#374151", 
            color: "white", 
            border: "none", 
            borderRadius: "12px", 
            fontSize: buttonFontSize, 
            fontWeight: "600", 
            cursor: file ? "pointer" : "not-allowed" 
          }}
        >
          Analyze Resume →
        </button>
      </div>
    </div>
  )
}
