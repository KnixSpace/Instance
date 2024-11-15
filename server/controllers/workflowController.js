const { Integration } = require("../models/Integration");
const { WorkFlow } = require("../models/Workflow");

//WIP
async function createWorkflow(req, res) {
  const workflow = new WorkFlow({
    name: req.body.name,
    description: req.body.description,
    version: 1,
    status: "active",
    nodes: req.body.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      name: node.name,
      data: node.data || {},
      position: node.position,
    })),
    edges: req.body.edges.map((edge) => ({
      id: edge.id,
      source: { nodeId: edge.source },
      target: { nodeId: edge.target },
      type: edge.type,
    })),
    metadata: {
      createdBy: req.body.metadata.createdBy,
    },
  });

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
