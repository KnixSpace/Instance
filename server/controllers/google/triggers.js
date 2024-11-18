const { oauth2Client, isTokenExpired } = require("./config");
const { Google } = require("../../models/Google");
const { FlowEngine } = require("../../engine/flowEngine");

async function processSheetEntryTrigger(workflow,triggerNode) {
  try {
      const { spreadsheetId, lastProcessedRow, range } = triggerNode.data.config;
      const accountId = triggerNode.data.authAccountInfo._id;

      const account = await Google.findById(accountId).exec();

      if (!account) {
        console.error(`Account with ID ${accountId} not found`);
      }

      let access_token = account.tokens.accessToken;

      if (isTokenExpired(account.tokens.expiry)) {
        const tokens = await updateTokens(account);
        access_token = tokens.access_token;
      }

      oauth2Client.setCredentials({ access_token });

      // Fetch all new entries from the sheet
      const {newEntries, row} = await getNewEntriesFromSheet(
        oauth2Client,
        spreadsheetId,
        range,
        lastProcessedRow
      );

      if (newEntries && newEntries.length > 0) {
          workflow.nodes[0].data.config.lastProcessedRow = row;
          await workflow.save();
        for (const entry of newEntries) {
          const flowEngine = new FlowEngine();
          const response = {
            status: true,
            data: {
              newEntry: entry,
            },
          };

          await flowEngine.executeEngine(workflow, response);
        }
      } else {
        console.log("No new entries found for workflow:", workflow._id);
      }
  } catch (error) {
    console.error("Error processing sheet entry trigger:", error);
  }
}

export { processSheetEntryTrigger };

// Schedule this function with node-cron
// cron.schedule("*/5 * * * *", () => {
//   console.log("Running processSheetEntryTrigger...");
//   processSheetEntryTrigger();
// });

//wrapping this function in node-corn and also need to take care that we get not a single row we get multiple rows so we need to run our flow engine for every row as this trigger is work for every single entry.