import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  Label,
} from "recharts";

const data = [
  { time: "T-25", cpu: 48, memory: 46 },
  { time: "T-24", cpu: 44, memory: 45 },
  { time: "T-23", cpu: 32, memory: 47 },
  { time: "T-22", cpu: 42, memory: 46 },
  { time: "T-21", cpu: 48, memory: 48 },
  { time: "T-20", cpu: 41, memory: 47 },
  { time: "T-19", cpu: 45, memory: 46 },
  { time: "T-18", cpu: 44, memory: 46 },
  { time: "T-17", cpu: 45, memory: 45 },
  { time: "T-16", cpu: 35, memory: 46 },
  { time: "T-15", cpu: 36, memory: 45 },
  { time: "T-14", cpu: 32, memory: 46 },
  { time: "T-13", cpu: 38, memory: 45 },
  { time: "T-12", cpu: 41, memory: 46 },
  { time: "T-11", cpu: 46, memory: 48 },
  { time: "T-10", cpu: 30, memory: 43 },
  { time: "T-09", cpu: 37, memory: 44 },
  { time: "T-08", cpu: 49, memory: 46 },
  { time: "T-07", cpu: 36, memory: 45 },
  { time: "T-06", cpu: 45, memory: 47 },
  { time: "T-05", cpu: 31, memory: 44 },
  { time: "T-04", cpu: 44, memory: 45 },
  { time: "T-03", cpu: 35, memory: 46 },
  { time: "T-02", cpu: 44, memory: 48 },
  { time: "T-01", cpu: 39, memory: 45 },
  { time: "Now", cpu: 44, memory: 46 },
];

function HistoryChart() {
  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>AI Resource Trend Analytics</h3>
          <p style={subtitleStyle}>
            X-axis: Time / Monitoring Interval • Y-axis: Resource Usage %
          </p>
        </div>

        <div style={legendStyle}>
          <span style={{ ...legendItemStyle, color: "#22d3ee" }}>● CPU Usage</span>
          <span style={{ ...legendItemStyle, color: "#a855f7" }}>● Memory Usage</span>
          <span style={{ ...legendItemStyle, color: "#22c55e" }}>● Normal</span>
          <span style={{ ...legendItemStyle, color: "#facc15" }}>● Warning</span>
          <span style={{ ...legendItemStyle, color: "#f97316" }}>● High</span>
          <span style={{ ...legendItemStyle, color: "#ef4444" }}>● Critical</span>
        </div>
      </div>

      <div style={axisInfoStyle}>
        <span>⬇ X-Axis: Time / Monitoring Interval</span>
        <span>⬆ Y-Axis: Resource Usage %</span>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 35, left: 30, bottom: 45 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <ReferenceArea y1={0} y2={40} fill="#22c55e" fillOpacity={0.06} />
          <ReferenceArea y1={40} y2={70} fill="#facc15" fillOpacity={0.07} />
          <ReferenceArea y1={70} y2={90} fill="#f97316" fillOpacity={0.08} />
          <ReferenceArea y1={90} y2={100} fill="#ef4444" fillOpacity={0.1} />

          <ReferenceLine y={40} stroke="#22c55e" strokeDasharray="4 4" />
          <ReferenceLine y={70} stroke="#facc15" strokeDasharray="4 4" />
          <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" />

          <XAxis dataKey="time" stroke="#60a5fa">
            <Label
              value="Time / Monitoring Interval"
              offset={-28}
              position="insideBottom"
              fill="#93c5fd"
              fontSize={14}
              fontWeight={700}
            />
          </XAxis>

          <YAxis stroke="#60a5fa" domain={[0, 100]}>
            <Label
              value="Resource Usage %"
              angle={-90}
              position="insideLeft"
              fill="#93c5fd"
              fontSize={14}
              fontWeight={700}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelFormatter={(label) => `Monitoring Interval: ${label}`}
            formatter={(value, name) => [
              `${value}%`,
              name === "cpu" ? "CPU Usage" : "Memory Usage",
            ]}
          />

          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="memory"
            stroke="#a855f7"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const containerStyle = {
  background: "#071028",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #1e293b",
};

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "14px",
  flexWrap: "wrap",
};

const titleStyle = {
  color: "white",
  margin: 0,
};

const subtitleStyle = {
  color: "#94a3b8",
  marginTop: "8px",
  marginBottom: 0,
};

const axisInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "10px",
  color: "#cbd5e1",
  fontWeight: "800",
  fontSize: "14px",
};

const legendStyle = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
  fontWeight: "800",
  maxWidth: "520px",
};

const legendItemStyle = {
  fontSize: "14px",
};

export default HistoryChart;