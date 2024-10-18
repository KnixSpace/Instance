const { google } = require("googleapis");

const sheets = google.sheets("v4");

async function sheetNewEntryTrigger() {
  //get all the flows that have na trigger node having triggerType = SHEET_ENTRY
  //then iterate through all of them using data in config object of trigger 
  //data in config object of trigger are sheetId, lastprocessedRow, userId, accountEmail, columnId to watch and extract data.
  //based on this data we can further get the new entry in sheet if there by calling api
  //if there is an token expiry then we can use our designed token updattion logic here
}
