// workflow.schema.js
const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["trigger", "action", "condition", "loop"],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  position: {
    x: Number,
    y: Number,
  },
});

const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    nodeId: {
      type: String,
      required: true,
    },
  },
  target: {
    nodeId: {
      type: String,
      required: true,
    },
  },
  condition: {
    type: String,
    enum: ["success", "failure", "default", null],
    default: null,
  },
});

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
    metadata: {
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
