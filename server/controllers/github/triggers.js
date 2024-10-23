const axios = require('axios');
const { Github } = require("../../models/Github");

// this api takes the repo is, repo name and the events array choosen by the user in the frontend
//events is in array of string

async function createWebhook(req, res) {
  const { repoId, repoName, events } = req.body; // Get repoId, repoName, and events from the request body
  const userId = '67138acaf879ca81f8fc428a'; // Example user ID, adjust as needed
  try {
    const githubAccount = await Github.findOne({ userId });

    if (!githubAccount) {
      return res.status(404).json({ message: 'GitHub account not linked' });
    }

    const accessToken = githubAccount.accessToken;

    let webhookUrl = `${process.env.HOST_URL}/api/v1/integration/auth/github/webhookInfo`;

    const existingWebhook = githubAccount.webhooks.find(
      (webhook) => webhook.repoId === repoId
    );

    if (existingWebhook) {

      const existingEvents = existingWebhook.events;
      const areEventsSame = JSON.stringify(events.sort()) === JSON.stringify(existingEvents.sort());

      if (areEventsSame) {

        return res.json({
          message: 'Webhook already exists with the same events',
          webhookId: existingWebhook.webhookId,
        });
      } else {
        const updateResponse = await axios.patch(
          `https://api.github.com/repos/${repoName}/hooks/${existingWebhook.webhookId}`,
          {
            config: {
              url: webhookUrl,
              content_type: 'json',
            },
            events: events, // Update with the new events
            active: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        existingWebhook.events = events;
        await githubAccount.save();

        return res.json({
          message: 'Webhook updated successfully',
          webhook: updateResponse.data,
        });
      }
    }
    else {
      const webhookResponse = await axios.post(
        `https://api.github.com/repos/${repoName}/hooks`,
        {
          name: 'web',
          config: {
            url: webhookUrl,
            content_type: 'json',
          },
          events: events, 
          active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      githubAccount.webhooks.push({
        repoId,
        repoName,
        webhookId: webhookResponse.data.id,
        events: webhookResponse.data.events,
      });
      await githubAccount.save();

      res.json({
        message: 'Webhook created successfully',
        webhook: webhookResponse.data,
      });
    }
  } catch (error) {
    console.error('Error creating/updating webhook:', error.response?.data || error);
    res.status(500).json({ message: 'Failed to create or update webhook' });
  }
}
async function handleWebhookEvent(req, res) {
  try {

    const eventType = req.headers['x-github-event']; 
    const hookId = req.headers['x-github-hook-id']; 
    const targetType = req.headers['x-github-hook-installation-target-type']; 
    const userAgent = req.headers['user-agent'];

    const {
      repository,
      pusher,
      head_commit
    } = req.body;

    const repoName = repository.full_name; 
    const repoUrl = repository.html_url; 

    const pusherId = pusher.id; 
    const pusherEmail = pusher.email;
    const pusherName = pusher.name; 

    const commitId = head_commit.id;
    const commitMessage = head_commit.message;
    const commitUrl = head_commit.url;

    const modifiedFiles = head_commit.modified; 

    const eventData = {
      eventType,
      hookId,
      targetType,
      userAgent,
      repository: {
        name: repoName,
        url: repoUrl
      },
      pusher: {
        id: pusherId,
        email: pusherEmail,
        name: pusherName
      },
      commit: {
        id: commitId,
        message: commitMessage,
        url: commitUrl,
        modifiedFiles
      }
    };

    // console.log(eventData);

    const query = {
      status: "active",
      'nodes': {
        $elemMatch: {
          type: "trigger", 
          'config.webhookId': eventData.hookId, 
          'config.events': { $in: [eventData.eventType] },
        }
      }
    };

    const matchingWorkflows = await WorkFlow.find(query).exec();
    // const workflows="";
    // if (matchingWorkflows.length > 0) {
    //   res.status(200).json({
    //     message: 'Matching workflows found',
    //     workflows: matchingWorkflows,
    //   });
    // }


    for (const workflow of matchingWorkflows) {
      await flowEngine.executeWorkflow(workflow, { "trigger-node": eventData })

      res.status(200).json({ message: 'Webhook event processed successfully', eventData });
    }
    
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ message: 'Error processing webhook event' });
  }
}
module.exports = { createWebhook, handleWebhookEvent };