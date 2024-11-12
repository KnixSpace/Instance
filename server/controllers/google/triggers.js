const { oauth2Client, isTokenExpired } = require("./config");
const { WorkFlow } = require("../../models/Workflow");
const { Google } = require("../../models/Google");
const { FlowEngine } = require("../../engine/flowEngine");

async function processSheetEntryTrigger() {
  const workflows = await WorkFlow.find({
    status: "active",
    nodes: {
      $elemMatch: {
        type: "trigger",
        "data.triggerType": "scheduled",
        "data.service": "google",
        "data.action": "SHEET_NEW_ENTRY",
      },
    },
  }).exec();

  for (const workflow of workflows) {
    const triggerNode = workflow.nodes.find((node) => node.type === "trigger");

    const { sheetId, lastProcessedRow, userId, accountEmail, range } =
      triggerNode.data.config;

    const account = await Google.findOne({
      userId,
      email: accountEmail,
    }).exec();

    let access_token = account.tokens.accessToken;

    if (isTokenExpired(account.tokens.expiry)) {
      const tokens = await updateTokens(account);
      access_token = tokens.access_token;
    }

    oauth2Client.setCredentials({ access_token });

    const newEntry = await getNewEntryOfSheet(
      oauth2Client,
      sheetId,
      range,
      lastProcessedRow
    );

    if (newEntry) {
      workflow.nodes[0].data.config.lastProcessedRow = newEntry.row;
      workflow.save();
      const flowEngine = new FlowEngine();
      await flowEngine.executeEngine(workflow, newEntry);
    } else {
      console.log("No new entry found");
    }
  }
}

//wrapping this function in node-corn and also need to take care that we get not a single row we get multiple rows so we need to run our flow engine for every row as this trigger is work for every single entry.