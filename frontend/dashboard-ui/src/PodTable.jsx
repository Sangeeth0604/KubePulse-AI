function PodTable({ pods }) {
  return (
    <div style={containerStyle}>
      <h2 style={{ color: "white" }}>Application Pods</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Pod Name</th>
            <th style={thStyle}>Namespace</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Node</th>
          </tr>
        </thead>

        <tbody>
          {pods.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan={4}>No pods found.</td>
            </tr>
          ) : (
            pods.map((pod, index) => (
              <tr key={index}>
                <td style={tdStyle}>{pod.name}</td>
                <td style={tdStyle}>{pod.namespace}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle}>{pod.status}</span>
                </td>
                <td style={tdStyle}>{pod.node}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const containerStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  marginBottom: "30px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  background: "#334155",
  color: "#ffffff",
  fontWeight: "700",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #334155",
  color: "#e5e7eb",
};

const badgeStyle = {
  background: "#16a34a",
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontWeight: "700",
};

export default PodTable;