// Kahn's algorithm for topological sorting
function topologicalSort(graph) {
    const inDegree = {};
    for (const node in graph) {
      inDegree[node] = 0;
    }
    for (const node in graph) {
      if (graph[node]) {
        //Handle cases where a node might not have outgoing edges.
        for (const neighbor of graph[node]) {
          inDegree[neighbor]++;
        }
      }
    }
  
    const queue = [];
    for (const node in inDegree) {
      if (inDegree[node] === 0) {
        queue.push(node);
      }
    }
  
    const sorted = [];
    while (queue.length > 0) {
      const node = queue.shift();
      sorted.push(node);
      if (graph[node]) {
        for (const neighbor of graph[node]) {
          inDegree[neighbor]--;
          if (inDegree[neighbor] === 0) {
            queue.push(neighbor);
          }
        }
      }
    }
  
    if (sorted.length !== Object.keys(graph).length) {
      throw new Error(
        "Cycle detected in the graph. Topological sort is not possible."
      );
    }
  
    return sorted;
  }

  module.exports = {topologicalSort} ;