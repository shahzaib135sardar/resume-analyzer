import React, { useState, useEffect } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setMenuOpen(false)
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", flexDirection: "column" }}>
      <header style={{ 
        height: "64px", 
        background: "#12121A", 
        borderBottom: "1px solid #1E1E2E", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: isMobile ? "0 16px" : "0 32px", 
        position: "sticky", 
        top: 0, 
        zIndex: 100 
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", background: "#6366F1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>R</div>
          <span style={{ fontSize: isMobile ? "16px" : "17px", fontWeight: "700", color: "#F1F5F9" }}>Resume<span style={{ color: "#6366F1" }}>AI</span></span>
          {!isMobile && (
            <span style={{ fontSize: "10px", fontWeight: "500", padding: "2px 8px", borderRadius: "20px", background: "rgba(99,102,241,0.15)", color: "#6366F1" }}>Powered by Groq</span>
          )}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {!isMobile ? (
            <>
              <Link to="/" style={{ fontSize: "14px", fontWeight: "500", color: "#94A3B8", textDecoration: "none" }}>Analyze</Link>
              {user ? (
                <>
                  <span style={{ fontSize: "13px", color: "#475569" }}>{user.name}</span>
                  <button onClick={handleLogout} style={{ fontSize: "13px", fontWeight: "500", background: "none", border: "1px solid #1E1E2E", borderRadius: "8px", padding: "6px 14px", color: "#94A3B8", cursor: "pointer" }}>Sign out</button>
                </>
              ) : (
                <Link to="/login" style={{ fontSize: "13px", fontWeight: "600", background: "#6366F1", color: "white", borderRadius: "8px", padding: "7px 16px", textDecoration: "none" }}>Sign In</Link>
              )}
            </>
          ) : (
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#94A3B8", 
                fontSize: "24px", 
                cursor: "pointer",
                padding: "8px"
              }}
              aria-label="Menu"
            >
              ☰
            </button>
          )}
        </div>
      </header>

      {isMobile && menuOpen && (
        <div style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          background: "#12121A",
          borderBottom: "1px solid #1E1E2E",
          padding: "16px",
          zIndex: 99,
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <Link 
            to="/" 
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: "16px", fontWeight: "500", color: "#F1F5F9", textDecoration: "none", padding: "12px" }}
          >
            Analyze
          </Link>
          {user ? (
            <>
              <span style={{ fontSize: "14px", color: "#94A3B8", padding: "12px" }}>{user.name}</span>
              <button 
                onClick={handleLogout}
                style={{ 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  background: "none", 
                  border: "1px solid #1E1E2E", 
                  borderRadius: "8px", 
                  padding: "12px 20px", 
                  color: "#94A3B8", 
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMenuOpen(false)}
              style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                background: "#6366F1", 
                color: "white", 
                borderRadius: "8px", 
                padding: "12px 20px", 
                textDecoration: "none",
                textAlign: "center"
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      )}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: "1px solid #1E1E2E", padding: isMobile ? "16px" : "20px 32px", textAlign: "center", fontSize: "13px", color: "#475569" }}>
        © 2024 ResumeAI. All rights reserved.
      </footer>
    </div>
  )
}
