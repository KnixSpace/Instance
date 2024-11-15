const cron = require('node-cron');
const { FlowEngine } = require('./flowEngine');
const { WorkFlow } = require('../models/Workflow');
const moment = require('moment-timezone');
const Queue = require('bull');
const workflowQueue = new Queue('workflow-queue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

const engine = new FlowEngine();
// console.log("Scheduler file has started executing");

workflowQueue.process(async (job) => {
    // console.log(`Processing workflow ${job.data.workflowId} from queue`);
    try {
        const workflow = await WorkFlow.findById(job.data.workflowId);
        if (!workflow) {
            console.error(`Workflow with ID ${job.data.workflowId} not found`);
            return;
        }
        const flowEngine = new FlowEngine();
        // flowEngine.executeEngine(workflow, job.data.initialData);

        const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');

        await updateNextRun(workflow, triggerNode);

        // console.log("Processing complete for workflow:", job.data.workflowId);
    } catch (error) {
        console.error(`Error processing workflow ${job.data.workflowId}:`, error);
    }
});


async function updateNextRun(workflow, triggerNode) {
    if (!triggerNode) return;
//about the arguments we get
    try {
        const { executionDate, schedule } = triggerNode.data;
        let nextRun;

        if (executionDate) {
            nextRun = null; 
        } else if (schedule) {
            // console.log("timer : ", schedule);
            const now = moment().tz(schedule.timezone || 'UTC');
            nextRun = now
                .add(schedule.hour || 0, 'hour')
                .add(schedule.minute || 0, 'minute')
                .toDate();
        }

        // const nodeIndex = workflow.nodes.findIndex(node => node._id.equals(triggerNode._id));
        // if (nodeIndex !== -1) {
        //     workflow.nodes[nodeIndex].data.nextRun = nextRun;
        // }

        await WorkFlow.updateOne(
            { "_id": workflow._id, "nodes._id": triggerNode._id },
            {
                $set: {
                    "nodes.$.data.nextRun": nextRun,  
                },
                $currentDate: { updatedAt: true }
            }
        );

        // console.log("nextRun updated:", nextRun);
    } catch (err) {
        console.log("Error updating nextRun", err);
    }
}

// Function to schedule workflow (add job to queue)
async function scheduleWorkflow(workflowId, triggerConfig) {
    try {
        const { initialData } = triggerConfig;

        workflowQueue.add({
            workflowId,
            initialData
        });
        console.log(`Workflow scheduled: ${workflowId}`);
    } catch (error) {
        console.log("Error in schedulingWorkflow", error);
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
        console.log("Error updating Workflow schedule", error);
    }
}

// Function to start change stream
async function startChangeStream() {
    try {
        console.log("Connected to MongoDB for scheduler");

        const initialWorkflows = await WorkFlow.find({
            'nodes.type': 'trigger',
            'nodes.data.triggerType': 'scheduler',
            'nodes.data.nextRun': { $lte: new Date() }
        });

        // console.log("Initial workflows to process:", initialWorkflows);

        for (const workflow of initialWorkflows) {
            const triggerNode = workflow.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');
            if (triggerNode) {
                console.log("Processing workflow:", workflow._id);
                await updateWorkflowSchedule(workflow._id, triggerNode.data);
                // await updateNextRun(workflowId, triggerNode); // Update nextRun
            }
        }

        const changeStream = WorkFlow.watch([
            {
                $match: {
                    'operationType': { $in: ['insert', 'update', 'replace'] },
                    'fullDocument.nodes': {  
                        $elemMatch: { 
                            type: 'trigger',
                            'data.triggerType': 'scheduler',
                        },
                    },
                },
            },
        ], { fullDocument: 'updateLookup' });



        changeStream.on('change', async (change) => {
            // console.log("Change detected:", change);
            const workflowId = change.fullDocument._id;
            const triggerNode = change.fullDocument.nodes.find(node => node.type === 'trigger' && node.data.triggerType === 'scheduler');
            try {
                await updateWorkflowSchedule(workflowId, triggerNode.data);
                // await updateNextRun(workflowId, triggerNode); 
            } catch (error) {
                console.log("Error handling change stream event:", error);
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

