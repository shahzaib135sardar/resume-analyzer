import React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", flexDirection: "column" }}>
      <header style={{ height: "64px", background: "#12121A", borderBottom: "1px solid #1E1E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", background: "#6366F1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>R</div>
          <span style={{ fontSize: "17px", fontWeight: "700", color: "#F1F5F9" }}>Resume<span style={{ color: "#6366F1" }}>AI</span></span>
          <span style={{ fontSize: "10px", fontWeight: "500", padding: "2px 8px", borderRadius: "20px", background: "rgba(99,102,241,0.15)", color: "#6366F1" }}>Powered by Groq</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/" style={{ fontSize: "14px", fontWeight: "500", color: "#94A3B8", textDecoration: "none" }}>Analyze</Link>
          {user ? (
            <>
              <span style={{ fontSize: "13px", color: "#475569" }}>{user.name}</span>
              <button onClick={handleLogout} style={{ fontSize: "13px", fontWeight: "500", background: "none", border: "1px solid #1E1E2E", borderRadius: "8px", padding: "6px 14px", color: "#94A3B8", cursor: "pointer" }}>Sign out</button>
            </>
          ) : (
            <Link to="/login" style={{ fontSize: "13px", fontWeight: "600", background: "#6366F1", color: "white", borderRadius: "8px", padding: "7px 16px", textDecoration: "none" }}>Sign In</Link>
          )}
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: "1px solid #1E1E2E", padding: "20px 32px", textAlign: "center", fontSize: "13px", color: "#475569" }}>
        © 2024 ResumeAI. All rights reserved.
      </footer>
    </div>
  )
}
