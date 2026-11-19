import dagre from "@dagrejs/dagre";
import type { Edge } from "@xyflow/react";
import type { OrgChartNode } from "./types";

export const NODE_SIZE = 180;
const CLUSTER_CARD_GAP = 4;
const CLUSTER_PADDING = 12;
const CLUSTER_BORDER = 2;
const CLUSTER_HEADER_HEIGHT = 56;

export function getClusterWidth(employeeCount: number): number {
  const count = Math.max(employeeCount, 1);
  const content = count * NODE_SIZE + (count - 1) * CLUSTER_CARD_GAP;
  return content + (CLUSTER_PADDING + CLUSTER_BORDER) * 2;
}

function getNodeSize(node: OrgChartNode) {
  if (node.type === "managerCluster") {
    return {
      width: getClusterWidth(node.data.employees.length),
      height: NODE_SIZE + CLUSTER_HEADER_HEIGHT,
    };
  }
  return { width: NODE_SIZE, height: NODE_SIZE };
}

export function layoutGraph<T extends OrgChartNode>(
  nodes: T[],
  edges: Edge[],
): T[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 300 });

  for (const node of nodes) {
    graph.setNode(node.id, getNodeSize(node));
  }
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const { x, y } = graph.node(node.id);
    const { width, height } = getNodeSize(node);
    return { ...node, position: { x: x - width / 2, y: y - height / 2 } };
  });
}
