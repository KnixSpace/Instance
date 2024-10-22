const axios = require('axios');
const { Github } = require("../../models/Github");

// this api takes the repo is, repo name and the events array choosen by the user in the frontend
//events is in array of string

async function createWebhook(req, res) {
  const { repoId, repoName, events } = req.body; // Get repoId, repoName, and events from the request body
  const userId = '67138acaf879ca81f8fc428a'; // Example user ID, adjust as needed
  try {
    // Find the GitHub account details for the user
    const githubAccount = await Github.findOne({ userId });

    if (!githubAccount) {
      return res.status(404).json({ message: 'GitHub account not linked' });
    }

    const accessToken = githubAccount.accessToken; // Get user's access token

    let webhookUrl = `${process.env.HOST_URL}/api/v1/integration/auth/github/webhookInfo`;

    const existingWebhook = githubAccount.webhooks.find(
      (webhook) => webhook.repoId === repoId
    );

    if (existingWebhook) {
      // Webhook exists, check if the events are the same
      const existingEvents = existingWebhook.events;

      // Compare the events array
      const areEventsSame = JSON.stringify(events.sort()) === JSON.stringify(existingEvents.sort());

      if (areEventsSame) {
        // If events are the same, return the existing webhook ID
        return res.json({
          message: 'Webhook already exists with the same events',
          webhookId: existingWebhook.webhookId,
        });
      } else {
        // If events are different, update the webhook on GitHub
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

        // Update webhook details in the database
        existingWebhook.events = events;
        await githubAccount.save();

        return res.json({
          message: 'Webhook updated successfully',
          webhook: updateResponse.data,
        });
      }
    }
    else {

      // If webhook doesn't exist, create a new one
      const webhookResponse = await axios.post(
        `https://api.github.com/repos/${repoName}/hooks`,
        {
          name: 'web',
          config: {
            url: webhookUrl,
            content_type: 'json',
          },
          events: events, // Specify the events for the webhook
          active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Save the new webhook details in the database
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
    // Extract data from the headers
    const eventType = req.headers['x-github-event']; // Event type (e.g., 'push')
    const hookId = req.headers['x-github-hook-id']; // Webhook ID
    const targetType = req.headers['x-github-hook-installation-target-type']; // Target type (e.g., 'repository')
    const userAgent = req.headers['user-agent']; // User-agent name

    // Extract data from the payload (body)
    const {
      repository,
      pusher,
      head_commit
    } = req.body;

    // Extract details from the repository object
    const repoName = repository.full_name; // Full name of the repo (e.g., 'flowmakerapp/firt')
    const repoUrl = repository.html_url; // Repo URL

    // Extract pusher details
    const pusherId = pusher.id; // Pusher ID
    const pusherEmail = pusher.email; // Pusher email
    const pusherName = pusher.name; // Pusher name

    // Extract commit details
    const commitId = head_commit.id; // Commit ID
    const commitMessage = head_commit.message; // Commit message
    const commitUrl = head_commit.url; // Commit URL

    // Extract modified files from head_commit
    const modifiedFiles = head_commit.modified; // Array of modified files (e.g., ['1.txt'])

    // Create an object with all the extracted data
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

    console.log(eventData);
    
    
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ message: 'Error processing webhook event' });
  }
}
module.exports = { createWebhook, handleWebhookEvent };