const axios = require("axios");
const { Github } = require("../../models/Github");
const { WorkFlow } = require("../../models/Workflow");
const { FlowEngine } = require("../../engine/flowEngine");

async function createWebhook(repoName, events, accountId) {
  try {
    const sanitizedRepoId = repoName.value;
    const sanitizedRepoName = repoName.label;
    const sanitizedEvents = events.map((event) => event.value);


    const githubAccount = await Github.findById(accountId);
    if (!githubAccount) {
      return res.status(404).json({ message: "GitHub account not linked" });
    }

    const { accessToken, webhooks } = githubAccount;
    const webhookUrl = `${process.env.HOST_URL}/api/v1/github/webhook/notifications`;

    const existingWebhook = webhooks.find(
      (webhook) => webhook.repoId === sanitizedRepoId.toString(),
    );
    if (existingWebhook) {
      const existingEvents = existingWebhook.events;
      const areEventsSame =
        JSON.stringify(sanitizedEvents.sort()) ===
        JSON.stringify(existingEvents.sort());

      if (areEventsSame) {
        return ({
          message: "Webhook already exists with the same events",
          webhookId: existingWebhook.webhookId,
        });
      }

      const updateResponse = await updateWebhook(
        sanitizedRepoName,
        existingWebhook.webhookId,
        webhookUrl,
        sanitizedEvents,
        accessToken
      );

      existingWebhook.events = sanitizedEvents;
      await githubAccount.save();

      return ({
        message: "Webhook updated successfully",
        webhookId: updateResponse.data.id,
      });

    }

    const webhookResponse = await createNewWebhook(
      sanitizedRepoName,
      webhookUrl,
      sanitizedEvents,
      accessToken
    );

    githubAccount.webhooks.push({
      repoId: sanitizedRepoId,
      repoName: sanitizedRepoName,
      webhookId: webhookResponse.data.id,
      events: webhookResponse.data.events,
    });
    await githubAccount.save();

    return {
      message: "Webhook created successfully",
      webhookId: webhookResponse.data.id,
    };
  } catch (error) {
    console.error(
      "Error creating/updating webhook:",
      error.response?.data || error
    );
  }
}

async function updateWebhook(
  repoName,
  webhookId,
  webhookUrl,
  events,
  accessToken
) {
  const url = `https://api.github.com/repos/${repoName}/hooks/${webhookId}`;
  const config = {
    config: {
      url: webhookUrl,
      content_type: "json",
    },
    events,
    active: true,
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return axios.patch(url, config, { headers });
}

async function createNewWebhook(repoName, webhookUrl, events, accessToken) {
  const url = `https://api.github.com/repos/${repoName}/hooks`;
  const config = {
    name: "web",
    config: {
      url: webhookUrl,
      content_type: "json",
    },
    events,
    active: true,
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/vnd.github+json",
  };

  return axios.post(url, config, { headers });
}

const handleWebhookEvent = async (req, res) => {
  try {
    const eventType = req.headers["x-github-event"];
    const hookId = req.headers["x-github-hook-id"];
    const targetType = req.headers["x-github-hook-installation-target-type"];
    const userAgent = req.headers["user-agent"];

    if (eventType === "ping") {
      console.log("Received ping event from GitHub");
      return res.status(200).json({ message: "Ping event received" });
    }

    const { repository, pusher, head_commit } = req.body;

    if (!repository || !head_commit) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const eventData = mapEventData(
      eventType,
      hookId,
      targetType,
      userAgent,
      repository,
      pusher,
      head_commit
    );

    const query = {
      status: "active",
      nodes: {
        $elemMatch: {
          type: "trigger",
          "data.config.webhookId": eventData.hookId.toString(),
          "data.config.events.value": { $in: [eventData.eventType] },
        },
      },
    };

    const matchingWorkflows = await WorkFlow.find(query).exec();

    if (matchingWorkflows.length === 0) {
      console.log("No matching workflows found for the webhook event");
      return res.status(200).json({ message: "No workflows matched" });
    }

    response = {
      status: true,
      data: eventData,
    };

    for (const workflow of matchingWorkflows) {
      const flowEngine = new FlowEngine(workflow._id);
      await flowEngine.executeEngine(workflow, response);
    }

    res.status(200).json({ message: "Webhook event processed successfully" });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).json({ message: "Error processing webhook event" });
  }
};

const mapEventData = (
  eventType,
  hookId,
  targetType,
  userAgent,
  repository,
  pusher,
  head_commit
) => ({
  eventType,
  hookId,
  // targetType,
  // userAgent,
  repository: {
    id: repository.id,
    name: repository.full_name,
    url: repository.html_url,
  },
  // pusher: {
  //   email: pusher?.email || null,
  //   name: pusher?.name || null,
  // },
  commit: {
    id: head_commit.id,
    message: head_commit.message,
    url: head_commit.url,
    modifiedFiles: head_commit.modified || [],
  },
});

module.exports = { createWebhook, handleWebhookEvent };
