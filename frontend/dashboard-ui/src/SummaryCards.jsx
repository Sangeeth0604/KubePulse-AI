import { motion } from "framer-motion";

function SummaryCards({ pods, alerts, memoryAlerts, predictions }) {
  const totalAlerts = alerts.length + memoryAlerts.length;

  const rawHealthScore =
    100 -
    alerts.length * 15 -
    memoryAlerts.length * 10 -
    predictions.length * 5;

  const healthScore = Math.max(0, rawHealthScore);

  let healthColor = "#22c55e";

  if (healthScore < 90 && healthScore >= 70) {
    healthColor = "#facc15";
  }

  if (healthScore < 70) {
    healthColor = "#ef4444";
  }

  const cards = [
    {
      title: "Running Pods",
      value: pods.length,
      color: "#22c55e",
    },
    {
      title: "Total Alerts",
      value: totalAlerts,
      color: totalAlerts === 0 ? "#22c55e" : "#ef4444",
    },
    {
      title: "AI Predictions",
      value: predictions.length,
      color: "#8b5cf6",
    },
    {
      title: "Cluster Health",
      value: `${healthScore}%`,
      color: healthColor,
    },
  ];

  return (
    <div style={gridStyle}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="dashboard-card"
          whileHover={{
            scale: 1.04,
            y: -5,
          }}
          transition={{
            duration: 0.2,
          }}
          style={{
            ...cardStyle,
            borderTop: `5px solid ${card.color}`,
          }}
        >
          <h3>{card.title}</h3>
          <h1 style={{ color: card.color }}>{card.value}</h1>
        </motion.div>
      ))}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  marginBottom: "30px",
};

const cardStyle = {
  padding: "20px",
  borderRadius: "14px",
  background: "#111827",
  color: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
};

export default SummaryCards;