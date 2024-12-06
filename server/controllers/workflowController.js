const mongoose = require("mongoose");
const { Integration } = require("../models/Integration");
const { WorkFlow } = require("../models/Workflow");
const { createWebhook } = require("./github/triggers");
const { topologicalSort } = require("../utils/topologicalsort");

//Implement the updateWorkflow function
async function updateWorkflow(req, res) {
  const { adjacencyList, workflowId, edges } = req.body;
  let nodes = req.body.nodes;

  if (!adjacencyList) {
    return res.status(400).json({ message: "Adjacency list is required." });
  }

  const executionOrder = topologicalSort(adjacencyList);
  //webhook creation logic update this for the webhook creation

  let node = nodes.find((n) => n.id === executionOrder[0]);
  if (
    node &&
    node.data.service === "Github" &&
    node.data.config !== undefined &&
    Object.keys(node.data.config).length > 0 &&
    node.data.config.events.length > 0 &&
    node.data.config.repoName !== ""
  ) {
    const { events, repoName } = node.data.config;
    const { _id: accountId } = node.data.authAccountInfo;

    let webhookData = {
      events,
      repoName,
      accountId,
    };

    try {
      let response = await createWebhook(
        webhookData.repoName,
        webhookData.events,
        webhookData.accountId
      );
      console.log("Webhook created successfully:", response);
      node.data.config.webhookId = response?.webhookId;
    } catch (error) {
      console.error("Error creating webhook:", error);
    }

    node = { ...node }; // Ensure node is updated properly
    nodes = nodes.map((n) => (n.id === node.id ? node : n));
  }

  try {
    const workflow = await WorkFlow.findByIdAndUpdate(
      workflowId,
      {
        $set: {
          nodes: nodes,
          edges,
          executionOrder,
        },
        $inc: { version: 1 },
      },
      { new: true }
    );

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ message: "Error updating workflow" });
  }
}

//Implement the status active update function
async function updateStatus(req, res) {
  const { workflowId, status } = req.body;
  try {
    let workflow = await WorkFlow.findById(workflowId);
    if (status) {
      workflow.status = "active";
      workflow = await workflow.save();
      return res.status(200).json({ status: workflow.status });
    } else {
      workflow.status = "inactive";
      workflow = await workflow.save();
      return res.status(200).json({ status: workflow.status });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating workflow status" });
  }
}

//Implement the workflow description update function
async function updateMetaData(req, res) {
  const { workflowId, description, name } = req.body;
  try {
    let workflow = await WorkFlow.findByIdAndUpdate(
      workflowId,
      { $set: { description: description, name: name } },
      { new: true }
    );
    return res
      .status(200)
      .json({ name: workflow.name, description: workflow.description });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating workflow title and description" });
  }
}

async function getAllWorkflows(req, res) {
  const userId = req.user.userId;
  try {
    const workflows = await WorkFlow.find({
      "metadata.userId": userId,
    });

    if (workflows.length > 0) {
      const summary = workflows.map((workflow) => {
        return {
          workflowId: workflow._id,
          name: workflow.name,
          description: workflow.description,
          status: workflow.status,
        };
      });
      return res.status(200).json(summary);
    } else {
      return res.status(404).json({ message: "No workflows found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching workflows" });
  }
}

//get all the details of a workflow
async function getWorkflow(req, res) {
  const { workflowId } = req.body;
  try {
    const workflows = await WorkFlow.findById(workflowId);
    if (!workflows) {
      return res.status(404).json({ message: "Workflow not found" });
    }
    res.status(200).json(workflows);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching workflows" });
  }
}

async function existWorkflow(req, res) {
  const { workflowId } = req.params;
  const userId = req.user.userId;
  try {
    const workflow = await WorkFlow.exists({
      _id: workflowId,
      "metadata.userId": userId,
    });
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }
    return res.status(200).json({ message: "Workflow found" });
  } catch (error) {
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
      userId: req.user.userId,
    },
  });

  try {
    const newWorkflow = await workflow.save();
    res.status(200).json(newWorkflow);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error creating workflow" });
  }
}

module.exports = {
  createWorkflow,
  fetchServiceAccount,
  updateWorkflow,
  updateStatus,
  getAllWorkflows,
  getWorkflow,
  updateMetaData,
  existWorkflow,
};
