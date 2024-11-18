import { Node } from "@/types/workflowTypes";
import { Edge } from "@xyflow/react";

export const getPreviousNodes = (
  adjacencyList: { [key: string]: string[] },
  selectedNode: string
): string[] => {
  const previousNodeSet = new Set<string>();
  const stack: [string] = [selectedNode];

  while (stack.length) {
    const currentNodeId = stack.pop();
    if (currentNodeId) {
      for (const node of adjacencyList[currentNodeId]) {
        if (!previousNodeSet.has(node)) {
          previousNodeSet.add(node);
          stack.push(node);
        }
      }
    }
  }

  return Array.from(previousNodeSet);
};

export const createAdjacencyList = (
  nodes: Node[],
  edges: Edge[],
  type: "forward" | "backward"
): { [key: string]: string[] } => {
  const adjacencyList: { [key: string]: string[] } = {};

  for (let node of nodes) {
    adjacencyList[node.id] = [];
  }

  for (let edge of edges) {
    if (type === "forward") adjacencyList[edge.source].push(edge.target);
    if (type === "backward") adjacencyList[edge.target].push(edge.source);
  }

  return adjacencyList;
};
