const cron = require('node-cron');
const { FlowEngine } = require('./flowEngine');
const { WorkFlow } = require("../models/Workflow");
const moment = require('moment-timezone');
const {queue} = require("../config/queue");

const workflowQueue = queue;
const engine = new FlowEngine();

workflowQueue.process(5, async (job) => {
    console.log(`Processing workflow ${job.data.workflowId} from queue`);
    try {
        const workflow = await WorkFlow.findById(job.data.workflowId);
        if (!workflow) {
            console.error(`Workflow with ID ${job.data.workflowId} not found`);
            return;
        }
        // await engine.executeEngine(workflow, job.data.initialData); // Execute the workflow
        console.log("Processing complete for workflow:", job.data.workflowId);
        //After successful execution update nextRun
        const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');
        if (triggerNode) {
            await updateNextRun(workflow, triggerNode);
        }

    } catch (error) {
        console.error(`Error processing workflow ${job.data.workflowId}:`, error);
    }
});


async function updateNextRun(workflow, triggerNode) {
    if (!triggerNode) return;
    try {
        const { schedule } = triggerNode.data;
        let nextRun;

        if (schedule) {
            const now = moment().tz(schedule.timezone || 'UTC');
            nextRun = now
                .add(schedule.day || 0, 'day') // Add days
                .add(schedule.hour || 0, 'hour')
                .add(schedule.minute || 0, 'minute')
                .add(schedule.second || 0, 'second')
                .toDate();
        }

        await WorkFlow.updateOne(
            { "_id": workflow._id, "nodes._id": triggerNode._id },
            {
                $set: {
                    "nodes.$.data.nextRun": nextRun,
                },
                $currentDate: { updatedAt: true }
            }
        );
        console.log("nextRun updated:", nextRun);
    } catch (err) {
        console.error("Error updating nextRun:", err);
    }
}

// Function to schedule workflow (add job to queue)
async function scheduleWorkflow(workflowId, triggerConfig) {
    try {
        const { nextRun, initialData } = triggerConfig;
        if(!nextRun) return;
       
        const delay = Math.max(0, nextRun - Date.now());
        console.log("delay", delay );
        await workflowQueue.add({ workflowId, initialData }, { delay });
        
        console.log(`Workflow ${workflowId} scheduled for ${moment(nextRun).format()}`);
    } catch (error) {
        console.error("Error scheduling workflow:", error);
    }
}

async function updateWorkflowSchedule(workflowId, triggerConfig) {
    try {
        const existingJobInQueue = await workflowQueue.getJob(workflowId.toString());
        if (existingJobInQueue) {
            await existingJobInQueue.remove();
        }
        await scheduleWorkflow(workflowId, triggerConfig);
    } catch (error) {
        console.error("Error updating Workflow schedule:", error);
    }
}

// Function to start change stream (modified)
async function startChangeStream() {
    try {
        console.log("Connected to MongoDB for scheduler");
        //Process initial workflows before starting the change stream
        const initialWorkflows = await WorkFlow.find({
            'nodes.type': 'trigger',
            'nodes.data.triggerType': 'scheduler',
            'nodes.data.nextRun': { $lte: new Date() }
        });

        for (const workflow of initialWorkflows) {
            const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');
            if (triggerNode) {
                console.log(`Scheduling existing workflow: ${workflow._id}`);
                await updateWorkflowSchedule(workflow._id, triggerNode.data);
            }
        }

        const changeStream = WorkFlow.watch([
        // {
        // $match: { operationType: { $exists: true } } }
        // {
        //     $match: {
        //         $or: [
        //             {
        //                 operationType: 'insert',
        //                 'fullDocument.nodes': {
        //                     $elemMatch: {
        //                         type: 'trigger',
        //                         'data.triggerType': 'scheduler'
        //                     }
        //                 }
        //             },
        //             {
        //                 operationType: 'update',
        //                 'updateDescription.updatedFields': {
                        
        //                         $in: [
        //                             "nodes.$.data.nextRun",
        //                             "nodes.$.data.schedule" // Include schedule field
        //                         ]
        //                 },
        //                 'fullDocument.nodes': {
        //                     $elemMatch: {
        //                         type: 'trigger',
        //                         'data.triggerType': 'scheduler'
        //                     }
        //                 }
        //             }
        //         ]
        //     }
        // }

        // { $match: { operationType: { $exists: true } } }

    {
                        $match: {
                            'operationType': { $in: ['insert', 'update']},
                            'fullDocument.nodes': {  
                                $elemMatch: { 
                                    'type' : 'trigger',
                                    'data.triggerType': 'scheduler',
                                },
                            },
                        },
                    },
        ], { fullDocument: 'updateLookup' });

        changeStream.on('change', async (change) => {
            
            const workflowId = change.fullDocument._id;
    const triggerNode = change.fullDocument.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');
    try {
        if (triggerNode) {
            await updateWorkflowSchedule(workflowId, triggerNode.data);
        }
    } catch (error) {
        console.error('Error handling change stream event:', error);
    }
});
      

        changeStream.on('error', (err) => {
            console.error("Change Stream Error:", err);
            setTimeout(startChangeStream, 5000); 
        });

    } catch (error) {
        console.error("Error setting up change streams:", error);
    }
}
module.exports = { startChangeStream };
