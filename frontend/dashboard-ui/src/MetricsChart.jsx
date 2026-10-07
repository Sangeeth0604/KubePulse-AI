import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MetricsChart({ alerts, memoryAlerts }) {
  const cpuChartData = {
    labels: alerts.map((item) => item.pod),
    datasets: [
      {
        label: "CPU Usage (m)",
        data: alerts.map((item) => item.cpu_m),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
      },
    ],
  };

  const memoryChartData = {
    labels: memoryAlerts.map((item) => item.pod),
    datasets: [
      {
        label: "Memory Usage (Mi)",
        data: memoryAlerts.map((item) =>
          item.memory?.endsWith("Ki")
            ? Math.round(parseInt(item.memory.replace("Ki", "")) / 1024)
            : parseInt(item.memory) || 0
        ),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white" },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#334155" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#334155" },
      },
    },
  };

  return (
    <div>
      <h3>CPU Usage Analytics</h3>
      <Line data={cpuChartData} options={options} />

      <h3 style={{ marginTop: "40px" }}>Memory Usage Analytics</h3>
      <Line data={memoryChartData} options={options} />
    </div>
  );
}

export default MetricsChart;