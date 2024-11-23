import { Node } from "@/types/workflowTypes";
import { Edge } from "@xyflow/react";

export const getNodes = (
  adjacencyList: { [key: string]: string[] },
  selectedNodeId: string,
  isRoot: boolean = false
): string[] => {
  const previousNodeSet = new Set<string>();
  const stack: [string] = [selectedNodeId];

  while (stack.length) {
    const currentNodeId = stack.pop();
    if (currentNodeId) {
      if(adjacencyList[currentNodeId]){ 
      for (const node of adjacencyList[currentNodeId]) {
        if (!previousNodeSet.has(node)) {
          previousNodeSet.add(node);
          stack.push(node);
        }
      }
    }
    }
  }

  if (isRoot) {
    previousNodeSet.add(selectedNodeId);
  }

  return Array.from(previousNodeSet);
};

export const getPreviousNodes = (
  adjacencyList: { [key: string]: string[] },
  selectedNodeId: string,
  isRoot: boolean = false
): string[] => {
  return getNodes(adjacencyList, selectedNodeId, isRoot);
};

export const getNextNodes = (
  adjacencyList: { [key: string]: string[] },
  selectedNodeId: string,
  isRoot: boolean = false
): string[] => {
  return getNodes(adjacencyList, selectedNodeId, isRoot);
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
    if (type === "forward") adjacencyList[edge.source]?.push(edge.target);
    if (type === "backward") adjacencyList[edge.target]?.push(edge.source);
  }

  return adjacencyList;
};
