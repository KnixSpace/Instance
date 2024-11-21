const { EventEmitter } = require("events");
const { queue } = require("../config/queue");
const { executeHandler } = require("./actionHandlers");

class FlowEngine extends EventEmitter {
  constructor() {
    super();
    this.workflowQueue = queue;
    this.workflowQueue.process(this.processWorkflowNode.bind(this));
  }

  async executeEngine(workflow, response) {
    const executionContext = {
      workflowId: workflow._id,
      data: {},
      nodeStatus: new Map(),
      logs: [],
    };
    console.log(`Initializing workflow execution for ${workflow._id}`);

    try {
      // Access the trigger node using the first index in the executionOrder array
      const triggerNode = workflow.nodes.find(
        (node) => node.id === workflow.executionOrder[0]
      );
      console.log(`Processing trigger node: ${triggerNode.id}`);
      executionContext.data[triggerNode.id] = response.data;
      executionContext.nodeStatus.set(triggerNode.id, "success");
      console.log(
        `Trigger node ${triggerNode.id} processed. Initial data set:`,
        response.data
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
            executionContext,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing workflow execution:", error);
      throw error;
    }
  }

  async processWorkflowNode(job) {
    const { node, workflowId, executionContext } = job.data;

    try {
      executionContext.nodeStatus.set(node.id, "running");
      this.emit("nodeStatusUpdate", {
        workflowId,
        nodeId: node.id,
        status: "running",
      });

      // Execute the step using the service handler
      const handlerResult = await executeHandler(node.data, executionContext);
      executionContext.nodeStatus.set(node.id, handlerResult.status);

      if (!handlerResult.status) {
        console.error(
          `Step ${node.id} failed for workflow ${workflowId}. Stopping execution.`
        );
        await this.workflowQueue.empty(); // Clear the queue
        console.error(`Workflow execution failed: ${handlerResult.error}`);
        return; // Stop further execution
      }

      Object.assign(executionContext.data[node.id], handlerResult.data);

      // Log execution history in the console
      console.log(
        "Execution Context for Step:",
        JSON.stringify(executionContext, null, 2)
      );

      console.log(
        `Step ${node.id} completed successfully for workflow ${workflowId}`
      );
    } catch (error) {
      console.error(`Error processing step ${node.id}:`, error);
    }
  }
}

module.exports = { FlowEngine };
