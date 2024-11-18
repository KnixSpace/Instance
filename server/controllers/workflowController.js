const { Integration } = require("../models/Integration");
const { WorkFlow } = require("../models/Workflow");

// Kahn's algorithm for topological sorting
function topologicalSort(graph) {
  const inDegree = {};
  for (const node in graph) {
    inDegree[node] = 0;
  }
  for (const node in graph) {
    if (graph[node]) { //Handle cases where a node might not have outgoing edges.
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
    throw new Error("Cycle detected in the graph. Topological sort is not possible.");
  }

  return sorted;
}

async function createWorkflow(req, res) {

  const { adjacencyList } = req.body;

  if (!adjacencyList) {
    return res.status(400).json({ message: "Adjacency list is required." });
  }

  const executionOrder = topologicalSort(adjacencyList);

  const workflow = new WorkFlow({
    name: req.body.name,
    description: req.body.description,
    version: 1,
    status: "draft",
    nodes: req.body.nodes,
    edges: req.body.edges,
    executionOrder: executionOrder,
    metadata: {
      createdBy: req.body.metadata.createdBy,
    },
  });
  // console.log(adjacencyList);
  // console.log(executionOrder);
  // res.status(200).json({ message: "Workflow created successfully" });
  res.json(await workflow.save());
}

async function fetchServiceAccount(req, res) {
  try {
    if (!req.body.service) {
      return res.status(400).json({ message: "Service is required" });
    }
    const { service, scopes } = req.body;

    const integration = await Integration.findOne({
      userId: req.user.userId,
      provider: service,
    }).populate({
      path: "accounts",
      match:
        service === "google" && scopes?.length > 0
          ? {
            scopes: { $all: scopes },
          }
          : {},
      select: "email name avatar",
    });

    if (!integration || !integration.accounts.length) {
      return res.status(404).json({ message: "No account found" });
    }

    res.json({ accounts: integration.accounts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching service account" });
  }
}

module.exports = { createWorkflow, fetchServiceAccount };
