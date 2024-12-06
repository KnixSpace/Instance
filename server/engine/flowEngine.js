const { EventEmitter } = require("events");
const { newQueue } = require("../utils/queue");
const { executeHandler } = require("./actionHandlers");

class FlowEngine extends EventEmitter {
  constructor(queueName) {
    super();
    this.workflowQueue = newQueue(queueName);
    this.workflowQueue.process(this.processWorkflowNode.bind(this));
    this.executionContext = {
      workflowId: "",
      data: {},
      nodeStatus: new Map(),
      logs: [],
    };
  }

  async executeEngine(workflow, response) {
    console.log(`Initializing workflow execution for ${workflow._id}`);

    try {
      // Access the trigger node using the first index in the executionOrder array
      const triggerNode = workflow.nodes.find(
        (node) => node.id === workflow.executionOrder[0]
      );
      console.log(
        `Processing trigger node: ${triggerNode.id} for workflow: ${workflow._id}`
      );
      this.executionContext.workflowId = workflow._id;
      this.executionContext.data[triggerNode.id] = response.data;
      this.executionContext.nodeStatus.set(triggerNode.id, "success");
      console.log(
        `Trigger node: ${triggerNode.id} processed successfully for workflow: ${workflow._id}`
      );

      // Emit a status update for the trigger node
      this.emit("nodeStatusUpdate", {
        workflowId: workflow._id,
        nodeId: triggerNode.id,
        status: "success",
      });

      // Add all subsequent nodes (starting from index 1) to the queue
      for (let i = 1; i < workflow.executionOrder.length; i++) {
        const node = workflow.nodes.find(
          (n) => n.id === workflow.executionOrder[i]
        );

        if (node) {
          await this.workflowQueue.add({
            node,
            workflowId: workflow._id,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing workflow execution:", error);
      throw error;
    }
  }

  async processWorkflowNode(job) {
    const { node, workflowId } = job.data;

    try {
      this.executionContext.nodeStatus.set(node.id, "running");
      this.emit("nodeStatusUpdate", {
        workflowId,
        nodeId: node.id,
        status: "running",
      });
      console.log(`Processing step: ${node.id} for workflow: ${workflowId}`);

      // Execute the step using the service handler
      const handlerResult = await executeHandler(
        node.data,
        this.executionContext.data
      );
      // console.log(`Handler Result: ${node.id}`, handlerResult);
      this.executionContext.nodeStatus.set(node.id, handlerResult.status);

      if (!handlerResult.status) {
        console.error(
          `Step ${node.id} failed for workflow ${workflowId}. Stopping execution.`
        );
        await this.workflowQueue.empty(); // Clear the queue
        console.error(`Workflow execution failed: ${handlerResult.error}`);
        return; // Stop further execution
      }

      this.executionContext.data[node.id] =
        this.executionContext.data[node.id] || {};

      Object.assign(this.executionContext.data[node.id], handlerResult.data);

      // console.log(
      //   "Execution Context for Step:",
      //   JSON.stringify(this.executionContext, null, 2)
      // );

      console.log(
        `Processing step: ${node.id} completed successfully for workflow: ${workflowId}`
      );
    } catch (error) {
      console.error(`Error processing step ${node.id}:`, error);
    }
  }
}

module.exports = { FlowEngine };
