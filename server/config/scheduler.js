const cron = require('node-cron');
const { FlowEngine } = require('../engine/FlowEngine');
const { WorkFlow } = require('../models/Workflow');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Queue = require('bull'); 
const workflowQueue = new Queue('workflow-queue', {
    redis: {
        host: 'localhost',
        port: 6379,         
      }
    }); 

const engine = new FlowEngine();
 
workflowQueue.process(async (job) => {
    console.log(`Processing workflow ${job.data.workflowId} from queue`);
    try {
      const workflow = await WorkFlow.findById(job.data.workflowId);
      if (!workflow) {
        console.error(`Workflow with ID ${job.data.workflowId} not found`);
        return;
      }
  
      await engine.executeWorkflow(workflow, job.data.initialData);
  
      const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.config.triggerType === 'scheduled');
  
      if(triggerNode) {
          const { cronExpression, executionDate, timezone } = triggerNode.config;
  
          let nextRun;
  
          if (cronExpression){
  
              nextRun = cron.schedule(cronExpression).nextInvocation().toDate(); // Use cronExpression
          } else if (executionDate){
              nextRun = null; // One-time execution, set to null after running
          }
  
           await WorkFlow.findByIdAndUpdate(workflow._id, {
               "nodes.$.config.nextRun": nextRun // Update nextRun in the database. Important.
           }, { new: true, arrayFilters: [{ 'el.type': 'trigger', 'el.config.triggerType': 'scheduled' }]}); // Correct arrayFilters syntax
      }
  
  
    } catch (error) {
      console.error(`Error executing workflow ${job.data.workflowId}:`, error);
      // Handle errors (e.g., retries, logging) as needed by your queue system
      throw error; // Re-throw to let Bull handle retry logic
  
  
    }
});


// // Function to update workflow's nextRun
// async function updateNextRun(workflowId, triggerNode) {

//     if(!triggerNode) return;

//     const { cronExpression, executionDate, timezone } = triggerNode.config;

//     let nextRun;

//     if (cronExpression){
//         nextRun = cron.schedule(cronExpression).nextInvocation().toDate();
//     } else if (executionDate){
//         nextRun = null; // One-time execution, set to null after running
//     }



//      try {
//          await WorkFlow.findByIdAndUpdate(workflowId, {
//              "nodes.$.config.nextRun": nextRun
//          }, { new: true, arrayFilters: [{ 'el.type': 'trigger', 'el.config.triggerType': 'scheduled' }]});
//      } catch(err){
//           console.log("Error updating nextRun", err);
//      }




// }


async function scheduleWorkflow(workflowId, triggerConfig) {

        try {

        const {initialData} = triggerConfig;

        workflowQueue.add({
            workflowId,
            initialData
        });


        } catch (error) {
            console.log("Error in schedulingWorkflow", error);
        }


}



async function updateWorkflowSchedule(workflowId, triggerConfig) {
    try {

        const existingJobInQueue = await workflowQueue.getJob(workflowId.toString()); // check if job with given ID is in queue or not

        if (existingJobInQueue) {
            await existingJobInQueue.remove(); // remove job from queue.
        }

        await scheduleWorkflow(workflowId, triggerConfig); // Add the updated workflow to the queue to be executed by the processor


    } catch (error) {
        console.log("Error updating Workflow schedule", error);
    }

}



mongoose.connection.once('open', async() => {

  try {

     // Initial scheduling (run once on startup)
      const initialWorkflows = await WorkFlow.find({
            'nodes.type': 'trigger',
            'nodes.config.triggerType': 'scheduled',
            'nodes.config.nextRun': { $lte: new Date() }
      });


      for (const workflow of initialWorkflows) {
        const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.config.triggerType === 'scheduled');
          if(triggerNode){
              await scheduleWorkflow(workflow._id, triggerNode.config); // Initial scheduling
              await updateNextRun(workflow._id, triggerNode); // Updating the nextRun.
          }
      }


     const changeStream = WorkFlow.watch([{
        $match: {
          'operationType': { $in: ['insert', 'update', 'replace'] },
          'fullDocument.nodes.type': 'trigger',
          'fullDocument.nodes.config.triggerType': 'scheduled'
        }
      }]);


     changeStream.on('change', async (change) => {

        const workflowId = change.fullDocument._id;


        const triggerNode = change.fullDocument.nodes.find(node => node.type === 'trigger' && node.config.triggerType === 'scheduled');


          try {

             await updateWorkflowSchedule(workflowId, triggerNode.config); // Update/reschedule workflow
             await updateNextRun(workflowId, triggerNode);


          } catch (error) {
                console.log("Error handling change stream event:", error);
          }


      });




        changeStream.on('error', (err) => {
            console.error("Change Stream Error:", err);
            // Implement proper error handling and retry logic
            setTimeout(startChangeStream, 5000); //Retry after 5 seconds.



        });

    } catch (error) {
        console.error("Error setting up change streams:", error);

    }





});





// module.exports = { /* ... other exports, updateWorkflowSchedule,  etc. ... */ };