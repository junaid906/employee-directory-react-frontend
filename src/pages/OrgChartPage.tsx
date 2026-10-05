import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { listEmployees } from "../api/employees";
import type { Employee } from "../types/employee";
import EmployeeNode from "../components/EmployeeNode";
import { buildGraph, layoutGraph } from "../lib/orgChart";
import { useNavigate } from "react-router";

const nodeTypes = { employee: EmployeeNode };

function OrgChart() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Could not load employees. Is the API running on http://localhost:5102?",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  console.log(employees[3]);

  const { nodes, edges } = useMemo(() => {
    const { nodes, edges } = buildGraph(employees);
    return layoutGraph(nodes, edges);
  }, [employees]);

  if (loading) {
    return <p className="text-neutral-500">Loading org chart…</p>;
  }

  if (error) {
    return (
      <div className="rounded border border-neutral-300 bg-white p-4">
        <p className="text-black">{error}</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return <p className="text-neutral-500">No employees found.</p>;
  }

  return (
    <div className="h-screen w-full rounded border border-neutral-300 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => navigate(`/employees/${node.id}`)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function OrgChartPage() {
  return (
    <ReactFlowProvider>
      <OrgChart />
    </ReactFlowProvider>
  );
}
