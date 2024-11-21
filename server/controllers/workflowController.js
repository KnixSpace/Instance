const { Integration } = require("../models/Integration");
const { WorkFlow } = require("../models/Workflow");

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

//WIP: Implement the updateWorkflow function
async function updateWorkflow(req, res) {
  const { adjacencyList, workflowId } = req.body;

  if (!adjacencyList) {
    return res.status(400).json({ message: "Adjacency list is required." });
  }

  const executionOrder = topologicalSort(adjacencyList);
  try {
    const workflow = await WorkFlow.findByIdAndUpdate(workflowId, {
      nodes: req.body.nodes,
      edges: req.body.edges,
      executionOrder: executionOrder,
    }, { $inc: { version: 1 } }, { new: true });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ message: "Error updating workflow" });
  }
}

//Implement the status active update function
async function statusUpdate(req, res) {
  const { workflowId, status } = req.body;

  try {
    let workflow = await WorkFlow.findById(workflowId);
    if (status === "active") {
      workflow.status = "inactive";
      workflow = await workflow.save();
      return res.status(400).json({ status: workflow.status });
    }
    else {
      workflow.status = "active";
      workflow = await workflow.save();
      return res.status(200).json({ status: workflow.status });
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Error updating workflow status" });
  }
};

//Implement the workflow description update function
async function updateMetaData(req, res) {
  const { workflowId, description, name } = req.body;
  try {
    let workflow = await WorkFlow.findByIdAndUpdate(workflowId, { $set: { description: description, name: name } }, { new: true });
    console.log("workflow", workflow);
    return res.status(200).json({ name: workflow.name, description: workflow.description });
  } catch (error) {
    return res.status(500).json({ message: "Error updating workflow title and description" });
  }
}

// get all the workflows (title, description, status,id)
async function getWorkflowSummary(req, res) {
  const { workflowId } = req.body;
  try {
    const workflows = await WorkFlow.findById(workflowId);
    const summary = {
      workflowId,
      name: workflows.name,
      description: workflows.description,
      status: workflows.status
    };
    res.status(200).json(summary);
  }
  catch (error) {
    return res.status(500).json({ message: "Error fetching workflows" });
  }

}

//get all the details of a workflow

async function getWorkflowdetails(req, res) {
  const { workflowId } = req.body;
  try {
    const workflows = await WorkFlow.findById(workflowId);
    res.status(200).json(workflows);
  }
  catch (error) {
    return res.status(500).json({ message: "Error fetching workflows" });
  }
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

async function createWorkflow(req, res) {
  const { name, description } = req.body;
  const { username } = req.user;

  const workflow = new WorkFlow({
    name,
    description,
    metadata: {
      createdBy: username,
    },
  });

  try {
    const newWorkflow = await workflow.save();
    res.status(200).json(newWorkflow);
  } catch (error) {
    res.status(500).json({ message: "Error creating workflow" });
  }
}

module.exports = { createWorkflow, fetchServiceAccount, updateWorkflow, statusUpdate, getWorkflowSummary, getWorkflowdetails, updateMetaData };
