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
