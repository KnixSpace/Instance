const { EventEmitter } = require("events");
const { getHanderData } = require("./serviceHandlers");

class FlowEngine extends EventEmitter {
  constructor() {
    super();
  }

  async executeWorkflow(workflow, initialData) {
    const executionContext = {
      workflowId: workflow._id,
      data: {},
      nodeStatus: new Map(),
      logs: [],
    };

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

      context.data[currentNode.data.service] = result;

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
        return node.config.data;
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
    return await getHanderData(
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

  //WIP
  isScheduledTriggerDue(triggerConfig) {}

  //WIP
  async executeScheduledTrigger(triggerConfig) {}

  //WIP
  async waitForUserInput(triggerConfig) {}
}

module.exports = new FlowEngine();
