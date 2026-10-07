import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import DependencyGraph from "./DependencyGraph";
import HistoryChart from "./HistoryChart";
import SummaryCards from "./SummaryCards";
import PodTable from "./PodTable";
import AIChatAssistant from "./AIChatAssistant";

function Dashboard({ theme = "dark", toggleTheme = () => {} }) {
  const [summary, setSummary] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState("ALL");
  const [riskTrend, setRiskTrend] = useState([]);
  const [remediationSimulated, setRemediationSimulated] = useState(false);
  const incidentReportRef = useRef(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setError(null);

        const response = await fetch("http://localhost:8000/live-summary");

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`${response.status} ${response.statusText}: ${text}`);
        }

        const data = await response.json();

        setSummary(data);
        setLastUpdated(new Date().toLocaleTimeString());

        try {
          const eventsRes = await fetch("http://localhost:8000/events");

          if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            setEvents(Array.isArray(eventsData) ? eventsData : []);
          } else {
            setEvents([]);
          }
        } catch (err) {
          console.warn("Failed to fetch events:", err.message || err);
          setEvents([]);
        }

        try {
          const trendRes = await fetch("http://localhost:8000/risk-trend");

          if (trendRes.ok) {
            const trendData = await trendRes.json();
            setRiskTrend(Array.isArray(trendData) ? trendData : []);
          } else {
            setRiskTrend([]);
          }
        } catch (err) {
          console.warn("Failed to fetch risk trend:", err.message || err);
          setRiskTrend([]);
        }
      } catch (err) {
        setError(`Live summary fetch failed: ${err.message}`);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const simulateRemediation = () => {
    setRemediationSimulated(true);
  };

  const exportIncidentReportPDF = async () => {
    if (!incidentReportRef.current) return;

    try {
      const canvas = await html2canvas(incidentReportRef.current, {
        scale: 2,
        backgroundColor: "#0f172a",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text("CampusPulse AI - Incident Report", 10, 15);

      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 22);

      pdf.addImage(imgData, "PNG", 10, 30, imgWidth, Math.min(imgHeight, pageHeight - 40));
      pdf.save(`CampusPulse-Incident-${incidentReport.incident_id || "report"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please check console for details.");
    }
  };

  if (!summary) {
    return <div style={loadingStyle}>Loading CampusPulse AI Dashboard...</div>;
  }

  const pods = summary.pods || [];
  const filteredPods =
    selectedNamespace === "ALL"
      ? pods
      : pods.filter((pod) => pod.namespace === selectedNamespace);

  const namespaces = ["ALL", ...new Set(pods.map((pod) => pod.namespace))];

  const alerts = summary.cpu_alerts || [];
  const memoryAlerts = summary.memory_alerts || [];
  const insights = summary.insights || [];
  const predictions = summary.predictions || [];

  const recommendations = summary.recommendations || {
    priority: "LOW",
    recommendations: [],
  };

  const remediation = summary.remediation || [];
  const incidentReport = summary.incident_report || {};

  const riskScore = summary.risk_score || {
    overall_risk: 0,
    cpu_risk: 0,
    memory_risk: 0,
    stability: "Unknown",
    confidence: 0,
    status: "Risk score unavailable.",
  };

  const systemStatus = summary.system_status || "Healthy";

  const hasIssues =
    alerts.length > 0 || memoryAlerts.length > 0 || predictions.length > 0;

  const clusterHealth = `${summary.cluster_health || (hasIssues ? 85 : 98)}%`;

  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#0f172a" : "#f1f5f9";
  const textColor = isDark ? "#e5e7eb" : "#0f172a";
  const panelColor = isDark ? "#1e293b" : "#ffffff";
  const cardColor = isDark ? "#0f172a" : "#f8fafc";
  const borderColor = isDark ? "#334155" : "#cbd5e1";

  const themedPanelStyle = {
    ...panelStyle,
    background: panelColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
  };

  const themedRiskPanelStyle = {
    ...riskPanelStyle,
    background: panelColor,
    color: textColor,
  };

  const themedRecommendationPanelStyle = {
    ...recommendationPanelStyle,
    background: panelColor,
    color: textColor,
  };

  const themedIncidentPanelStyle = {
    ...incidentPanelStyle,
    background: panelColor,
    color: textColor,
  };

  const themedStatusBoxStyle = {
    ...statusBoxStyle,
    background: panelColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
  };

  const themedFilterBarStyle = {
    ...filterBarStyle,
    background: panelColor,
    border: `1px solid ${borderColor}`,
  };

  const themedIncidentCardStyle = {
    ...incidentCardStyle,
    background: cardColor,
    border: `1px solid ${borderColor}`,
    color: textColor,
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "LOW":
        return {
          background: "#14532d",
          color: "#86efac",
        };

      case "MEDIUM":
        return {
          background: "#78350f",
          color: "#facc15",
        };

      case "HIGH":
        return {
          background: "#7f1d1d",
          color: "#fca5a5",
        };

      case "CRITICAL":
        return {
          background: "#991b1b",
          color: "#ffffff",
          boxShadow: "0 0 14px rgba(239,68,68,0.75)",
        };

      default:
        return {
          background: "#334155",
          color: "#e2e8f0",
        };
    }
  };

  return (
    <div
      style={{
        ...pageStyle,
        background: backgroundColor,
        color: textColor,
      }}
    >
      <motion.div
        style={headerStyle}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <button
            onClick={toggleTheme}
            style={{
              marginBottom: "14px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "800",
              background: isDark ? "#f8fafc" : "#0f172a",
              color: isDark ? "#0f172a" : "#f8fafc",
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            {isDark ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

          <h1 style={{ ...titleStyle, color: textColor }}>CampusPulse AI Dashboard</h1>
          <p style={{ ...subtitleStyle, color: isDark ? "#94a3b8" : "#475569" }}>
            AI-powered Kubernetes operational intelligence platform
          </p>

          <div style={liveBadgeStyle} className="live-pulse">
            🟢 Live Monitoring • Refreshing Every 5 Seconds
          </div>
        </div>

        <motion.div
          className={systemStatus === "Healthy" ? "card-hover-glow" : "card-hover-glow risk-pulse"}
          style={themedStatusBoxStyle}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              ...statusTextStyle,
              color: systemStatus === "Healthy" ? "#22c55e" : "#ef4444",
            }}
          >
            {systemStatus === "Healthy" ? "🟢 Healthy" : "🔴 Degraded"}
          </div>

          <div style={updatedTextStyle}>
            Last Updated: {lastUpdated || "Loading..."}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SummaryCards
          pods={pods}
          alerts={alerts}
          memoryAlerts={memoryAlerts}
          predictions={predictions}
        />
      </motion.div>

      {error && <div style={errorStyle}>{error}</div>}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div style={themedFilterBarStyle}>
          <label style={filterLabelStyle}>Filter Namespace:</label>

          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            style={dropdownStyle}
          >
            {namespaces.map((namespace) => (
              <option key={namespace} value={namespace}>
                {namespace}
              </option>
            ))}
          </select>
        </div>

        <PodTable pods={filteredPods} />
      </motion.div>

      <div style={gridStyle}>
        <motion.section className="card-hover-glow shimmer-card" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2>🚨 Live Alerts</h2>

          {alerts.length === 0 && memoryAlerts.length === 0 ? (
            <div style={emptyStyle}>No active CPU or memory alerts.</div>
          ) : (
            <>
              {alerts.map((alert, index) => (
                <motion.div key={`cpu-${index}`} style={cpuAlertStyle} whileHover={{ scale: 1.02 }}>
                  <strong>CPU Alert:</strong> {alert.pod}
                  <div>Usage: {alert.cpu} ({alert.cpu_m}m)</div>
                  <div>Status: {alert.alert}</div>
                </motion.div>
              ))}

              {memoryAlerts.map((alert, index) => (
                <motion.div key={`mem-${index}`} style={memoryAlertStyle} whileHover={{ scale: 1.02 }}>
                  <strong>Memory Alert:</strong> {alert.pod}
                  <div>Usage: {alert.memory}</div>
                  <div>Status: {alert.alert}</div>
                </motion.div>
              ))}
            </>
          )}
        </motion.section>

        <motion.section className="card-hover-glow shimmer-card" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
          <h2>🔮 Predictive AI Risk</h2>

          {predictions.length === 0 ? (
            <div style={emptyStyle}>No predictions available.</div>
          ) : (
            predictions.map((item, index) => (
              <motion.div key={index} style={predictionStyle} whileHover={{ scale: 1.02 }}>
                <strong>{item.pod}</strong>
                <div>Risk: {item.risk}</div>
                <div>{item.prediction}</div>
              </motion.div>
            ))
          )}
        </motion.section>

        <motion.section className="card-hover-glow risk-pulse" style={themedRiskPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.11 }} viewport={{ once: true }}>
          <h2>🎯 AI Risk Score</h2>

          <div style={riskScoreNumberStyle}>{riskScore.overall_risk}/100</div>

          <div style={riskLabelStyle}>
            Cluster Stability: {riskScore.stability}
          </div>

          <div style={progressGroupStyle}>
            <div>CPU Risk: {riskScore.cpu_risk}%</div>
            <div style={progressBarStyle}>
              <div style={{ ...progressFillStyle, width: `${riskScore.cpu_risk}%`, background: "#ef4444" }} />
            </div>
          </div>

          <div style={progressGroupStyle}>
            <div>Memory Risk: {riskScore.memory_risk}%</div>
            <div style={progressBarStyle}>
              <div style={{ ...progressFillStyle, width: `${riskScore.memory_risk}%`, background: "#f97316" }} />
            </div>
          </div>

          <div style={progressGroupStyle}>
            <div>AI Confidence: {riskScore.confidence}%</div>
            <div style={progressBarStyle}>
              <div style={{ ...progressFillStyle, width: `${riskScore.confidence}%`, background: "#22c55e" }} />
            </div>
          </div>

          <div style={confidenceBoxStyle}>
            <strong>AI Confidence Score: {riskScore.confidence}%</strong>
            <div style={{ marginTop: "8px" }}>Based on:</div>
            <div>✓ CPU Metrics Analysis</div>
            <div>✓ Memory Metrics Analysis</div>
            <div>✓ Dependency Relationship Analysis</div>
            <div>✓ Historical Resource Trends</div>
          </div>

          <p style={riskStatusStyle}>{riskScore.status}</p>
        </motion.section>

        <motion.section className="card-hover-glow shimmer-card" style={themedRecommendationPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} viewport={{ once: true }}>
          <h2>🤖 AI Recommendation</h2>

          <motion.div style={recommendationStyle} whileHover={{ scale: 1.02 }}>
            <strong>Priority: {recommendations.priority}</strong>

            <ul style={{ marginTop: "12px", lineHeight: "1.8" }}>
              {recommendations.recommendations.length === 0 ? (
                <li>No remediation needed. Cluster is operating normally.</li>
              ) : (
                recommendations.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.section>

        <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14 }} viewport={{ once: true }}>
          <h2>🛠 Auto Remediation Plan</h2>

          {remediation.length === 0 ? (
            <div style={emptyStyle}>No remediation actions required.</div>
          ) : (
            remediation.map((item, index) => (
              <motion.div key={index} style={remediationCardStyle} whileHover={{ scale: 1.02 }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>{item.title}</strong>
                </div>

                <div>
                  Severity:
                  <span
                    style={{
                      ...severityBadgeStyle,
                      ...getSeverityStyle(item.severity),
                    }}
                  >
                    {item.severity}
                  </span>
                </div>

                <div style={{ marginTop: "6px" }}>{item.reason}</div>
                <pre style={commandStyle}>{item.command}</pre>
              </motion.div>
            ))
          )}

          <motion.button
            onClick={simulateRemediation}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={simulateButtonStyle}
          >
            🚀 Simulate Auto Scale
          </motion.button>

          {remediationSimulated && (
            <motion.div style={simulationResultStyle} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <strong>✅ AI Action Executed</strong>
              <div>Scaled result-service from 1 → 2 replicas</div>
              <div>Horizontal Pod Autoscaler recommendation applied</div>
              <div>Risk Score reduced from 81 → 65</div>
            </motion.div>
          )}
        </motion.section>

        <motion.section className="card-hover-glow" style={themedIncidentPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.145 }} viewport={{ once: true }}>
          <div style={incidentHeaderRowStyle}>
            <h2 style={{ margin: 0 }}>📄 AI Incident Report</h2>

            <motion.button
              onClick={exportIncidentReportPDF}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={pdfButtonStyle}
            >
              📥 Export PDF
            </motion.button>
          </div>

          <div ref={incidentReportRef} style={themedIncidentCardStyle}>
            <h3 style={{ marginTop: 0, color: textColor }}>
              {incidentReport.title || "No Active Incident"}
            </h3>

            <p><strong>Incident ID:</strong> {incidentReport.incident_id || "N/A"}</p>

            <p>
              <strong>Severity:</strong>{" "}
              <span
                style={{
                  ...severityBadgeStyle,
                  ...getSeverityStyle(incidentReport.severity || "LOW"),
                }}
              >
                {incidentReport.severity || "LOW"}
              </span>
            </p>

            <p><strong>Risk Score:</strong> {incidentReport.risk_score ?? 0}/100</p>

            <hr style={incidentHrStyle} />

            <p><strong>Root Cause:</strong><br />{incidentReport.root_cause || "No abnormal resource behavior detected."}</p>
            <p><strong>Impact:</strong><br />{incidentReport.impact || "Cluster is operating normally."}</p>
            <p><strong>Recommended Resolution:</strong><br />{incidentReport.recommended_resolution || "Continue monitoring cluster health."}</p>

            <div style={incidentStatusStyle}>
              Status: {incidentReport.status || "Resolved"}
            </div>
          </div>
        </motion.section>

        <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}>
          <h2>🧠 Root Cause Insights</h2>

          {insights.length === 0 ? (
            <div style={emptyStyle}>No AI insights available.</div>
          ) : (
            insights.map((item, index) => {
              const icons = ["🔥", "📈", "🔗", "⚠️", "✅", "🧠"];
              const icon = icons[index % icons.length];

              return (
                <motion.div key={index} style={insightStyle} whileHover={{ scale: 1.02 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{icon}</span>
                    <div>{item.insight}</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.section>

        <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
          <h2>🔗 Pod Dependency Map</h2>
          <DependencyGraph />
        </motion.section>

        
      </div>


      <div style={twoColumnSectionStyle}>
        <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} viewport={{ once: true }}>
          <h2>📋 AI Cluster Summary</h2>

          <div style={summaryBoxStyle}>
            <p>✅ Running Pods: {pods.length}</p>
            <p>🚨 Active Alerts: {alerts.length + memoryAlerts.length}</p>
            <p>🔮 Risk Predictions: {predictions.length}</p>
            <p>📊 Cluster Health: {clusterHealth}</p>

            <hr style={summaryHrStyle} />

            <p>
              AI analysis indicates elevated CPU load on <strong>result-service</strong> and increased memory pressure on <strong>grading-db-pod</strong>.
            </p>

            <p>
              Current dependency chain suggests database stress is linked to heavy result processing requests.
            </p>
          </div>
        </motion.section>

        <motion.section className="card-hover-glow shimmer-card" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>📡 Cluster Events Timeline</h2>

        {events.length === 0 ? (
          <div style={emptyStyle}>No cluster events available.</div>
        ) : (
          <div style={eventsContainerStyle}>
            {events.map((item, index) => (
              <motion.div
                key={index}
                className="timeline-fade"
                style={eventCardStyle}
                whileHover={{ x: 6, scale: 1.01 }}
              >
                <div style={eventTimeStyle}>{item.time}</div>
                <div style={eventMessageStyle}>{item.event}</div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
      </div>

      <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>📈 AI Risk Trend</h2>

        {riskTrend.length === 0 ? (
          <div style={emptyStyle}>No risk trend data available.</div>
        ) : (
          <div style={riskTrendChartStyle}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.08} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis dataKey="time" stroke="#94a3b8" />

                <YAxis stroke="#94a3b8" domain={[0, 100]} />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  fill="url(#riskColor)"
                  strokeWidth={3}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.section>

      <motion.section className="card-hover-glow" style={themedPanelStyle} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2>📊 Historical Metrics</h2>
        <HistoryChart />
      </motion.section>

      <motion.section
        className="card-hover-glow shimmer-card"
        style={themedPanelStyle}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <AIChatAssistant summary={summary} />
      </motion.section>

      <motion.footer className="dashboard-footer" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h3>CampusPulse AI</h3>
        <p>AI-powered Kubernetes Operational Intelligence Platform</p>
        <div className="footer-tech">Kubernetes • React • FastAPI • Chart.js • AI Risk Engine</div>
        <small>© 2026 Team RuchiNotFound | Smart Pod Discovery & Dependency Mapping</small>
      </motion.footer>
    </div>
  );
}

const loadingStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const pageStyle = {
  minHeight: "100vh",
  padding: "24px",
  background: "#0f172a",
  color: "#e5e7eb",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const titleStyle = {
  marginBottom: "4px",
  color: "white",
};

const subtitleStyle = {
  marginTop: 0,
  marginBottom: 0,
  color: "#94a3b8",
};

const liveBadgeStyle = {
  display: "inline-block",
  marginTop: "10px",
  padding: "8px 14px",
  background: "#14532d",
  color: "#86efac",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "700",
};

const statusBoxStyle = {
  background: "#1e293b",
  padding: "16px 22px",
  borderRadius: "14px",
  minWidth: "270px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  border: "1px solid #334155",
};

const statusTextStyle = {
  fontWeight: "800",
  fontSize: "18px",
};

const updatedTextStyle = {
  color: "#94a3b8",
  marginTop: "6px",
  fontSize: "14px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px",
  marginTop: "24px",
};

const panelStyle = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "24px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
};

const recommendationPanelStyle = {
  ...panelStyle,
  border: "1px solid #10b981",
};

const incidentPanelStyle = {
  ...panelStyle,
  border: "1px solid #38bdf8",
};

const incidentCardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "14px",
  padding: "18px",
  lineHeight: "1.8",
};

const incidentHrStyle = {
  border: "none",
  height: "1px",
  background: "rgba(255,255,255,0.14)",
  margin: "14px 0",
};

const incidentStatusStyle = {
  marginTop: "15px",
  color: "#22c55e",
  fontWeight: "bold",
};

const errorStyle = {
  padding: "14px",
  background: "#7f1d1d",
  color: "white",
  borderRadius: "10px",
  marginBottom: "20px",
};

const emptyStyle = {
  padding: "14px",
  background: "#334155",
  borderRadius: "10px",
  color: "#cbd5e1",
};

const cpuAlertStyle = {
  padding: "14px",
  background: "#7f1d1d",
  borderRadius: "10px",
  marginBottom: "12px",
};

const memoryAlertStyle = {
  padding: "14px",
  background: "#7c2d12",
  borderRadius: "10px",
  marginBottom: "12px",
};

const predictionStyle = {
  padding: "14px",
  background: "#312e81",
  borderRadius: "10px",
  marginBottom: "12px",
};

const insightStyle = {
  padding: "14px",
  background: "#4c1d95",
  borderRadius: "10px",
  marginBottom: "12px",
};

const recommendationStyle = {
  padding: "16px",
  background: "#064e3b",
  color: "#d1fae5",
  borderRadius: "12px",
  border: "1px solid #10b981",
};

const remediationCardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "12px",
};

const commandStyle = {
  background: "#020617",
  color: "#38bdf8",
  padding: "10px",
  borderRadius: "8px",
  overflowX: "auto",
  marginTop: "10px",
  fontSize: "13px",
};

const simulateButtonStyle = {
  marginTop: "12px",
  padding: "12px 18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
};

const simulationResultStyle = {
  marginTop: "14px",
  padding: "14px",
  background: "#064e3b",
  border: "1px solid #10b981",
  borderRadius: "12px",
  color: "#d1fae5",
  lineHeight: "1.8",
};

const riskPanelStyle = {
  ...panelStyle,
  border: "1px solid #ef4444",
};

const riskScoreNumberStyle = {
  fontSize: "48px",
  fontWeight: "800",
  color: "#ef4444",
  marginBottom: "10px",
};

const riskLabelStyle = {
  color: "#fca5a5",
  fontWeight: "700",
  marginBottom: "18px",
};

const progressGroupStyle = {
  marginBottom: "14px",
};

const progressBarStyle = {
  width: "100%",
  height: "10px",
  background: "#334155",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "6px",
};

const progressFillStyle = {
  height: "100%",
  borderRadius: "999px",
};

const confidenceBoxStyle = {
  marginTop: "14px",
  padding: "14px",
  background: "#064e3b",
  border: "1px solid #10b981",
  borderRadius: "12px",
  color: "#d1fae5",
  lineHeight: "1.7",
};

const riskStatusStyle = {
  marginTop: "18px",
  color: "#fecaca",
  lineHeight: "1.6",
};

const summaryBoxStyle = {
  background: "rgba(59, 130, 246, 0.08)",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  borderRadius: "14px",
  padding: "18px",
  lineHeight: "1.8",
  color: "#e2e8f0",
};

const summaryHrStyle = {
  border: "none",
  height: "1px",
  background: "rgba(255,255,255,0.12)",
  margin: "14px 0",
};

const eventsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "15px",
};

const eventCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "14px 18px",
  background: "rgba(59,130,246,0.08)",
  borderLeft: "4px solid #3b82f6",
  borderRadius: "12px",
};

const eventTimeStyle = {
  minWidth: "120px",
  color: "#60a5fa",
  fontWeight: "700",
};

const eventMessageStyle = {
  color: "#e2e8f0",
  fontSize: "15px",
};

const riskTrendContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const riskTrendCardStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px",
};

const riskTrendTimeStyle = {
  color: "#60a5fa",
  fontWeight: "700",
  marginBottom: "8px",
};

const riskTrendBarStyle = {
  width: "100%",
  height: "10px",
  background: "#334155",
  borderRadius: "999px",
  overflow: "hidden",
};

const riskTrendFillStyle = {
  height: "100%",
  background: "#ef4444",
};

const riskTrendValueStyle = {
  marginTop: "8px",
  color: "#fca5a5",
  fontWeight: "700",
};


const riskTrendChartStyle = {
  height: "340px",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "14px",
  padding: "18px",
};


const filterBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
  background: "#1e293b",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #334155",
};

const filterLabelStyle = {
  fontWeight: "800",
  color: "#e2e8f0",
};

const dropdownStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  background: "#0f172a",
  color: "white",
  border: "1px solid #334155",
  fontWeight: "700",
  cursor: "pointer",
};

const severityBadgeStyle = {
  marginLeft: "8px",
  padding: "4px 10px",
  borderRadius: "999px",
  fontWeight: "800",
  fontSize: "12px",
  display: "inline-block",
};

const incidentHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  marginBottom: "16px",
  flexWrap: "wrap",
};

const pdfButtonStyle = {
  padding: "10px 16px",
  background: "#0ea5e9",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "800",
  cursor: "pointer",
};


const twoColumnSectionStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: "20px",
  alignItems: "stretch",
  marginTop: "24px",
};


export default Dashboard;