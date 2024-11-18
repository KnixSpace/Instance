// const { EventEmitter } = require("events");
// const { executeHandler } = require("./serviceHandlers");

// class FlowEngine extends EventEmitter {
//   constructor() {
//     super();
//   }

//   async executeEngine(workflow, initialData) {
//     const executionContext = {
//       workflowId: workflow._id,
//       data: {},
//       nodeStatus: new Map(),
//       logs: [],
//     };
// // initial data have to be added
//     const startNode = workflow.nodes.find((node) => node.type === "trigger");
//     await this.executeNode(workflow, startNode, executionContext, null,initialData);
//   }

//   async executeNode(workflow, currentNode, context, previousNode,initialData) {
//     try {
//       context.nodeStatus.set(currentNode.id, "running");
//       this.emit("nodeStatusUpdate", {
//         workflowId: context.workflowId,
//         nodeId: currentNode.id,
//         status: "running",
//       });
//       // console.log("in node");

//       let result;
//       if (currentNode.type === "trigger") {
//         result = await this.executeTriggerNode(currentNode, context,initialData);
//       } else {
//         result = await this.executeActionNode(
//           currentNode,
//           context,
//           previousNode
//         );
//       }
//       // context.data[currentNode.config.service] = result;
//        //this code will append the data to the same service , the last code was replacing the data
//       if (!context.data[currentNode.data.service]) {
//         context.data[currentNode.data.service] = {}; // Initialize it as an empty object if undefined
//       }
//       // console.log(context);

//       Object.assign(context.data[currentNode.data.service], result);
     
//       context.nodeStatus.set(currentNode.id, "success");
//       this.emit("nodeStatusUpdate", {
//         workflowId: context.workflowId,
//         nodeId: currentNode.id,
//         status: "success",
//       });
//       // console.log(context);

//       const nextEdges = workflow.edges.filter(
//         (edge) => edge.source.nodeId === currentNode.id
//       );

//       for (const edge of nextEdges) {
//         const nextNode = workflow.nodes.find(
//           (n) => n.id === edge.target.nodeId
//         );
//         if (nextNode) {
//           await this.executeNode(workflow, nextNode, context, currentNode);
//         }
//       }
//     } catch (error) {
//       context.nodeStatus.set(currentNode.id, "failed");
//       this.emit("nodeStatusUpdate", {
//         workflowId: context.workflowId,
//         nodeId: currentNode.id,
//         status: "failed",
//         error: error.message,
//       });
//       this.handleExecutionError(context, currentNode, error);
//     }
//   }

//   async executeTriggerNode(node, context,initialData) {
//     switch (node.data.triggerType) {
//       case "automatic":
//         context.data[node.data.service]=initialData;
//         return {};
//       case "scheduler":
//          return {};
//       case "user-initiated":
//         return await this.waitForUserInput(node.data);
//       default:
//         throw new Error(`Unknown trigger type: ${node.data.triggerType}`);
//     }
//   }

//   async executeActionNode(node, context, previousNode) {
//     const { service, action } = node.data;
// console.log(service);

//     return await executeHandler(
//       service,
//       action,
//       node.data,
//       context.data[previousNode.data.service]
//     );    
//   }

//   handleExecutionError(context, node, error) {
//     context.logs.push({
//       timestamp: new Date(),
//       level: "error",
//       nodeId: node.id,
//       message: `Error executing node: ${error.message}`,
//     });
//   }

//   //WIP
//   isScheduledTriggerDue(triggerConfig) {}

//   //WIP
//   async executeScheduledTrigger(triggerConfig) {
//     console.log("heyyyy");
//   return triggerConfig;
// }
//   //WIP
//   async waitForUserInput(triggerConfig) {}
// }

// module.exports = { FlowEngine };

    // async processWorkflowStep(job) {
    //     const { step, workflowId, initialData } = job.data;
    //     try {
    //         const workflow = await WorkFlow.findById(workflowId);
    //         const context = {
    //             workflowId,
    //             stepId: step.id,
    //             initialData,
    //             executionStatus: "running",
    //             result: null,
    //             error: null,
    //             data: {}, //Initialize data for this step
    //         };

    //         // Execute the step using the service handler
    //         const handlerResult = await executeHandler(step.type, step.action, step.data, context);
    //         context.result = handlerResult.result;
    //         context.executionStatus = handlerResult.status;
    //         context.error = handlerResult.error;
            
    //         if(context.executionStatus === 'failed'){
    //             console.error(`Step ${step.id} failed for workflow ${workflowId}. Stopping execution.`);
    //             await this.workflowQueue.empty(); // Clear the queue
    //             await WorkFlow.findByIdAndUpdate(workflowId, { status: 'failed' });
    //             throw new Error(`Workflow execution failed: ${context.error}`);
    //         }


    //         //Aggregate data from previous steps for this service.
    //         if (!context.data[step.data.service]) {
    //             context.data[step.data.service] = {};
    //         }
    //         Object.assign(context.data[step.data.service], context.result);
           

    //         // Update workflow status and history
    //         await WorkFlow.findByIdAndUpdate(workflowId, { $push: { executionHistory: context } });
    //         console.log(`Step ${step.id} completed successfully for workflow ${workflowId}`);
    //     } catch (error) {
    //         console.error(`Error processing step ${step.id}:`, error);
    //         // More sophisticated error handling (retries, alerts, etc.) could be added here.
    //     }
    // }

    const { EventEmitter } = require("events");
    const { queue } = require("../config/queue");
    const { executeHandler } = require("./serviceHandlers");
    
    class FlowEngine extends EventEmitter {
        constructor() {
            super();
            this.workflowQueue = queue;
            this.workflowQueue.process(this.processWorkflowStep.bind(this));
        }
    
        async executeEngine(workflow, initialData) {
            const executionContext = {
                workflowId: workflow._id,
                data: {},
                nodeStatus: new Map(),
                logs: [],
            };
    
            try {
                // Access the trigger node using the first index in the executionOrder array
                const triggerNode = workflow.nodes.find((node) => node.id === workflow.executionOrder[0]);
                console.log(`Processing trigger node: ${triggerNode.id}`);
                executionContext.data[triggerNode.id] = initialData;
                executionContext.nodeStatus.set(triggerNode.id, "success");
                console.log(`Trigger node ${triggerNode.id} processed. Initial data set:`, initialData);
    
                // Emit a status update for the trigger node
                // this.emit("nodeStatusUpdate", {
                //     workflowId: workflow._id,
                //     nodeId: triggerNode.id,
                //     status: "success",
                // });
    
                // Add all subsequent nodes (starting from index 1) to the queue
                for (let i = 1; i < workflow.executionOrder.length; i++) {
                    const node = workflow.nodes.find((n) => n.id === workflow.executionOrder[i]);
    
                    if (node) {
                        await this.workflowQueue.add({ step: node, workflowId: workflow._id, executionContext });
                    }
                }
            } catch (error) {
                console.error("Error initializing workflow execution:", error);
                throw error;
            }
        }
    
        async processWorkflowStep(job) {
            const { step, workflowId, executionContext } = job.data;
    
            try {
                executionContext.nodeStatus.set(step.id, "running");
                this.emit("nodeStatusUpdate", {
                    workflowId,
                    nodeId: step.id,
                    status: "running",
                });
    
                // Execute the step using the service handler
                const handlerResult = await executeHandler(step.data, executionContext);
                executionContext.nodeStatus.set(step.id, handlerResult.status);
    
                if (handlerResult.status === "failed") {
                    console.error(`Step ${step.id} failed for workflow ${workflowId}. Stopping execution.`);
                    await this.workflowQueue.empty(); // Clear the queue
                    console.error(`Workflow execution failed: ${handlerResult.error}`);
                    return; // Stop further execution
                }
    
                
                Object.assign(executionContext.data[step.id], handlerResult);
    
                // Log execution history in the console
                console.log("Execution Context for Step:", JSON.stringify(executionContext, null, 2));
    
                console.log(`Step ${step.id} completed successfully for workflow ${workflowId}`);
            } catch (error) {
                console.error(`Error processing step ${step.id}:`, error);
            }
        }
    }
    
    module.exports = { FlowEngine };
    
