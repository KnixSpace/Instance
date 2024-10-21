const { EventEmitter } = require("events");
const { WorkFlow } = require("../models/Workflow");
const { serviceHandlers, getHanderData } = require("./serviceHandlers");

class FlowEngine extends EventEmitter {
  constructor() {
    super();
    this.workflows = new Map();
    this.executionContext = new Map();
  }

  async handleTrigger(triggerType, payload) {
    // const triggeredWorkflows = Array.from(this.workflows.values()).filter(
    //   (workflow) =>
    //     workflow.nodes.some(
    //       (node) =>
    //         node.type === "trigger" && node.config.triggerType === triggerType
    //     )
    // );

    for (const workflow of triggeredWorkflows) {
      await this.executeWorkflow(workflow, payload);
    }
  }

  async executeWorkflow(workflow, initialData) {
    const executionId = generateExecutionId();
    const executionContext = {
      workflowId: workflow._id,
      executionId,
      data: { ...initialData },
      nodeStatus: new Map(),
      logs: [],
    };

    this.executionContexts.set(executionId, executionContext);

    const startNode = workflow.nodes.find((node) => node.type === "trigger");
    await this.executeNode(workflow, startNode, executionContext, null);
  }

  async executeNode(workflow, currentNode, context, previousNode) {
    try {
      context.nodeStatus.set(currentNode.id, "running");
      this.emit("nodeStatusUpdate", {
        workflowId: context.workflowId,
        nodeId: currentNode.id,
        status: "running",
      });

      let result;
      if (currentNode.type === "trigger") {
        result = await this.executeTriggerNode(currentNode, context);
      } else {
        result = await this.executeActionNode(
          currentNode,
          context,
          previousNode
        );
      }

      context.data[currentNode.id] = result;

      context.nodeStatus.set(currentNode.id, "success");
      this.emit("nodeStatusUpdate", {
        workflowId: context.workflowId,
        nodeId: currentNode.id,
        status: "success",
      });

      const nextEdges = workflow.edges.filter(
        (edge) => edge.source.nodeId === currentNode.id
      );
      for (const edge of nextEdges) {
        const nextNode = workflow.nodes.find(
          (n) => n.id === edge.target.nodeId
        );
        if (nextNode) {
          await this.executeNode(workflow, nextNode, context, currentNode);
        }
      }
    } catch (error) {
      context.nodeStatus.set(currentNode.id, "failed");
      this.emit("nodeStatusUpdate", {
        workflowId: context.workflowId,
        nodeId: currentNode.id,
        status: "failed",
        error: error.message,
      });
      this.handleExecutionError(context, currentNode, error);
    }
  }

  async executeTriggerNode(node, context) {
    switch (node.config.triggerType) {
      case "automatic":
        return context.data;
      case "scheduled":
        if (this.isScheduledTriggerDue(node.config)) {
          return await this.executeScheduledTrigger(node.config);
        }
        break;
      case "user-initiated":
        return await this.waitForUserInput(node.config);
      default:
        throw new Error(`Unknown trigger type: ${node.config.triggerType}`);
    }
  }

  async executeActionNode(node, context, previousNode) {
    const { service, action } = node.config;
    return getHanderData(
      service,
      action,
      node.config,
      context.data[previousNode.config.service]
    );
  }

  handleExecutionError(context, node, error) {
    context.logs.push({
      timestamp: new Date(),
      level: "error",
      nodeId: node.id,
      message: `Error executing node: ${error.message}`,
    });
  }

  isScheduledTriggerDue(triggerConfig) {}

  async executeScheduledTrigger(triggerConfig) {}

  async waitForUserInput(triggerConfig) {}
}

module.exports = new FlowEngine();
