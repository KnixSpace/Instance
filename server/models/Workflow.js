// workflow.schema.js
const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["trigger", "action", "condition", "loop"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      config: {},
    },
    position: {
      x: Number,
      y: Number,
    },
    selected: Boolean,
  },
  { _id: false }
);
//pending edges
const edgeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    sourceHandle: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    targetHandle: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft",
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    executionOrder: [String],
    metadata: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      createdBy: String,
      lastModified: {
        type: Date,
        default: Date.now,
      },
      tags: [String],
    },
  },
  { timestamps: true }
);

workflowSchema.index({ "nodes.id": 1 });
workflowSchema.index({ "edges.source.nodeId": 1 });
workflowSchema.index({ "edges.target.nodeId": 1 });

const WorkFlow = mongoose.model("Workflow", workflowSchema);
exports.WorkFlow = WorkFlow;
