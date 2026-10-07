import React from "react";
import ReactFlow, { ReactFlowProvider, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "student-login-service" },
    style: {
      padding: 10,
      border: "1px solid black",
      borderRadius: 10,
    },
  },

  {
    id: "2",
    position: { x: 250, y: 120 },
    data: { label: "result-service" },
    style: {
      padding: 10,
      border: "1px solid black",
      borderRadius: 10,
    },
  },

  {
    id: "3",
    position: { x: 250, y: 240 },
    data: { label: "grading-db-pod" },
    style: {
      padding: 10,
      border: "1px solid black",
      borderRadius: 10,
    },
  },

  {
    id: "4",
    position: { x: 500, y: 120 },
    data: { label: "fee-payment-service" },
    style: {
      padding: 10,
      border: "1px solid black",
      borderRadius: 10,
    },
  },
];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },

  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
  },

  {
    id: "e4-3",
    source: "4",
    target: "3",
    animated: true,
  },
];

function DependencyGraph() {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Pod Dependency Graph</h2>

      <div style={{ width: "100%", height: 360 }}>
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }} style={{ width: '100%', height: '100%' }}>
            <Controls />
            <Background gap={16} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default DependencyGraph;