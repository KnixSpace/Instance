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
      config: node.data || {},
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

module.exports = { createWorkflow };