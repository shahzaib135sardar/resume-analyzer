import React, { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import { useAnalysis } from "../hooks/useAnalysis"

export default function UploadPage() {
  const navigate = useNavigate()
  const { state, analyze, reset } = useAnalysis()
  const [jd, setJd] = useState("")
  const [file, setFile] = useState(null)

  const onDrop = useCallback((files) => {
    if (files[0]) setFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: "48px", height: "48px", border: "4px solid #1E1E2E", borderTopColor: "#6366F1", borderRadius: "50%", animation: "sp .8s linear infinite" }} />
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#F1F5F9" }}>Analyzing your resume...</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>{step}</p>
        <div style={{ width: "300px", height: "6px", background: "#1E1E2E", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: progress + "%", background: "#6366F1", borderRadius: "3px", transition: "width 0.5s ease" }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "660px", margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#6366F1", marginBottom: "12px" }}>AI-Powered Analysis</div>
        <h1 style={{ fontSize: "40px", lineHeight: "1.1", fontWeight: "800", letterSpacing: "-2px", color: "#F1F5F9", marginBottom: "16px" }}>Analyze Your Resume with AI</h1>
        <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: "1.7" }}>Get instant scoring, skill extraction, job match analysis and personalized improvement suggestions.</p>
      </div>

      <div style={{ background: "#12121A", border: "1px solid #1E1E2E", borderRadius: "16px", padding: "32px" }}>
        <div {...getRootProps()} style={{ border: "2px dashed " + (isDragActive ? "#6366F1" : file ? "#2D2D3F" : "#2D2D3F"), borderRadius: "12px", padding: file ? "18px 22px" : "48px 24px", textAlign: "center", cursor: "pointer", background: isDragActive ? "rgba(99,102,241,0.05)" : "#0A0A0F" }}>
          <input {...getInputProps()} />
          {file ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "28px" }}>??</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#F1F5F9" }}>{file.name}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>{Math.round(file.size / 1024)} KB</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null) }} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}>?</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>??</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#F1F5F9", marginBottom: "6px" }}>{isDragActive ? "Drop your PDF here" : "Drop your resume here"}</div>
              <div style={{ fontSize: "13px", color: "#475569" }}>or click to browse · PDF only · max 10MB</div>
            </div>
          )}
        </div>

        {state.phase === "error" && (
          <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{state.message}</span>
            <button onClick={reset} style={{ background: "none", border: "1px solid #EF4444", color: "#EF4444", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>Try Again</button>
          </div>
        )}

        <div style={{ marginTop: "22px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94A3B8", marginBottom: "8px" }}>Job Description <span style={{ fontWeight: "400", color: "#475569" }}>— optional</span></label>
          <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job description here to see match percentage..." rows={4} style={{ width: "100%", padding: "14px 16px", border: "1px solid #1E1E2E", borderRadius: "10px", background: "#0A0A0F", fontFamily: "inherit", fontSize: "14px", color: "#F1F5F9", resize: "vertical", outline: "none" }} />
        </div>

        <button onClick={() => file && analyze(file, jd)} disabled={!file} style={{ width: "100%", marginTop: "20px", padding: "16px 24px", background: "#6366F1", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: file ? "pointer" : "not-allowed", opacity: file ? 1 : 0.4 }}>
          Analyze Resume ?
        </button>
      </div>
    </div>
  )
}
