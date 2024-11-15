const { EventEmitter } = require("events");
const { executeHandler } = require("./serviceHandlers");

class FlowEngine extends EventEmitter {
  constructor() {
    super();
  }

  async executeEngine(workflow, initialData) {
    const executionContext = {
      workflowId: workflow._id,
      data: {},
      nodeStatus: new Map(),
      logs: [],
    };
// initial data have to be added
    const startNode = workflow.nodes.find((node) => node.type === "trigger");
    await this.executeNode(workflow, startNode, executionContext, null,initialData);
  }

  async executeNode(workflow, currentNode, context, previousNode,initialData) {
    try {
      context.nodeStatus.set(currentNode.id, "running");
      this.emit("nodeStatusUpdate", {
        workflowId: context.workflowId,
        nodeId: currentNode.id,
        status: "running",
      });
      // console.log("in node");

      let result;
      if (currentNode.type === "trigger") {
        result = await this.executeTriggerNode(currentNode, context,initialData);
      } else {
        result = await this.executeActionNode(
          currentNode,
          context,
          previousNode
        );
      }
      // context.data[currentNode.config.service] = result;
       //this code will append the data to the same service , the last code was replacing the data
      if (!context.data[currentNode.data.service]) {
        context.data[currentNode.data.service] = {}; // Initialize it as an empty object if undefined
      }
      // console.log(context);

      Object.assign(context.data[currentNode.data.service], result);
     
      context.nodeStatus.set(currentNode.id, "success");
      this.emit("nodeStatusUpdate", {
        workflowId: context.workflowId,
        nodeId: currentNode.id,
        status: "success",
      });
      // console.log(context);

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

  async executeTriggerNode(node, context,initialData) {
    switch (node.data.triggerType) {
      case "automatic":
        context.data[node.data.service]=initialData;
        return {};
      case "scheduler":
         return {};
      case "user-initiated":
        return await this.waitForUserInput(node.data);
      default:
        throw new Error(`Unknown trigger type: ${node.data.triggerType}`);
    }
  }

  async executeActionNode(node, context, previousNode) {
    const { service, action } = node.data;
console.log(service);

    return await executeHandler(
      service,
      action,
      node.data,
      context.data[previousNode.data.service]
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
  async executeScheduledTrigger(triggerConfig) {
    console.log("heyyyy");
  return triggerConfig;
}
  //WIP
  async waitForUserInput(triggerConfig) {}
}

module.exports = { FlowEngine };
