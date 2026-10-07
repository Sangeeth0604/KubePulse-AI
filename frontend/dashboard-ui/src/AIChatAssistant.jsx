import React, { useState } from "react";

function AIChatAssistant({ summary }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I am CampusPulse AI Assistant. Ask me about cluster health, risks, pods, remediation, CPU spikes, or memory pressure.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    let aiReply =
      "I could not understand. Try asking about risk, pods, CPU, memory, remediation, or cluster health.";

    const text = input.toLowerCase();

    if (text.includes("cluster degraded")) {
      aiReply =
        "Cluster is degraded due to high CPU usage in result-service and memory pressure in grading-db-pod.";
    }

    else if (text.includes("highest risk")) {
      aiReply =
        "result-service currently has the highest predicted infrastructure risk.";
    }

    else if (text.includes("kubectl")) {
      aiReply =
        "Suggested fix: kubectl scale deployment result-service --replicas=2";
    }

    else if (text.includes("memory")) {
      aiReply =
        "grading-db-pod is showing elevated memory usage and should be monitored carefully.";
    }

    else if (text.includes("cpu")) {
      aiReply =
        "AI detected critical CPU load in result-service reaching unsafe thresholds.";
    }

    else if (text.includes("health")) {
      aiReply =
        "Current cluster health is stable but under moderate AI risk observation.";
    }

    else if (text.includes("remediation")) {
      aiReply =
        "AI recommends horizontal pod autoscaling and traffic balancing for overloaded services.";
    }

    const aiMessage = {
      sender: "ai",
      text: aiReply,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);

    setInput("");
  };

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>🤖 AI Operations Assistant</h2>

          <p style={subtitleStyle}>
            Intelligent Kubernetes troubleshooting & live AI diagnostics
          </p>
        </div>

        <div style={statusStyle}>
          ● AI Online
        </div>
      </div>

      {/* CHAT BOX */}
      <div style={chatBoxStyle}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...messageStyle,
              alignSelf:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",

              background:
                msg.sender === "user"
                  ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                  : "linear-gradient(135deg,#6d28d9,#4c1d95)",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* QUICK QUESTIONS */}
      <div style={quickQuestionsStyle}>
        {[
          "Why is cluster degraded?",
          "Which pod has highest risk?",
          "Any memory issues?",
          "Suggest remediation",
        ].map((question, index) => (
          <button
            key={index}
            onClick={() => setInput(question)}
            style={quickButtonStyle}
          >
            {question}
          </button>
        ))}
      </div>

      {/* INPUT AREA */}
      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Ask AI about cluster health, pods, risks, CPU spikes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSend}
          style={buttonStyle}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const containerStyle = {
  background: "linear-gradient(180deg,#111827 0%, #071028 100%)",
  padding: "28px",
  borderRadius: "22px",
  marginBottom: "24px",
  border: "1px solid #334155",
  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "22px",
  flexWrap: "wrap",
  gap: "16px",
};

const titleStyle = {
  margin: 0,
  color: "white",
  fontSize: "30px",
  fontWeight: "800",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#94a3b8",
  fontSize: "15px",
};

const statusStyle = {
  background: "#14532d",
  color: "#86efac",
  padding: "10px 16px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "14px",
};

const chatBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  height: "500px",
  overflowY: "auto",
  marginTop: "16px",
  padding: "22px",
  background: "#020617",
  borderRadius: "18px",
  border: "1px solid #1e293b",
};

const messageStyle = {
  maxWidth: "75%",
  padding: "18px 22px",
  borderRadius: "18px",
  color: "white",
  lineHeight: "1.8",
  fontSize: "16px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
};

const quickQuestionsStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const quickButtonStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#cbd5e1",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const inputContainerStyle = {
  display: "flex",
  gap: "14px",
  marginTop: "22px",
};

const inputStyle = {
  flex: 1,
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "16px",
  outline: "none",
};

const buttonStyle = {
  padding: "0 28px",
  border: "none",
  borderRadius: "14px",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "16px",
  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
};

export default AIChatAssistant;