import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid operator credentials");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={glowCircleOne}></div>
      <div style={glowCircleTwo}></div>

      <div style={cardStyle}>
        <div style={logoStyle}>⚡</div>

        <h1 style={titleStyle}>CampusPulse AI</h1>
        <p style={subtitleStyle}>
          Secure AI-powered Kubernetes Operations Console
        </p>

        <div style={badgeStyle}>🔐 Authorized Operators Only</div>

        <input
          style={inputStyle}
          placeholder="Operator ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Access Key"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        {error && <div style={errorStyle}>⚠️ {error}</div>}

        <button style={buttonStyle} onClick={handleLogin}>
          Launch Dashboard
        </button>

        <p style={footerTextStyle}>
          Kubernetes • AI Risk Engine • Secure Monitoring
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #1d4ed8, transparent 30%), linear-gradient(135deg, #020617, #0f172a, #111827)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  position: "relative",
  overflow: "hidden",
};

const glowCircleOne = {
  position: "absolute",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  background: "rgba(37, 99, 235, 0.25)",
  filter: "blur(80px)",
  top: "8%",
  left: "10%",
};

const glowCircleTwo = {
  position: "absolute",
  width: "320px",
  height: "320px",
  borderRadius: "50%",
  background: "rgba(239, 68, 68, 0.18)",
  filter: "blur(90px)",
  bottom: "10%",
  right: "12%",
};

const cardStyle = {
  width: "430px",
  background: "rgba(30, 41, 59, 0.88)",
  backdropFilter: "blur(18px)",
  padding: "38px",
  borderRadius: "24px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  zIndex: 2,
};

const logoStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  marginBottom: "22px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "900",
};

const subtitleStyle = {
  color: "#cbd5e1",
  marginTop: "10px",
  lineHeight: "1.5",
};

const badgeStyle = {
  display: "inline-block",
  margin: "18px 0 24px",
  padding: "8px 14px",
  borderRadius: "999px",
  background: "rgba(37, 99, 235, 0.18)",
  color: "#93c5fd",
  border: "1px solid rgba(96, 165, 250, 0.35)",
  fontSize: "13px",
  fontWeight: "800",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "8px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "16px",
  boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
};

const errorStyle = {
  background: "#7f1d1d",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "14px",
  color: "#fecaca",
  fontWeight: "700",
};

const footerTextStyle = {
  marginTop: "20px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "13px",
};

export default Login;