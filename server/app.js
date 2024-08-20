const expressApp = require("./config/express");
const connectDB = require("./config/database");
require("dotenv").config();

const startApp = async () => {
  try {
    await connectDB();
    return expressApp;
  } catch (error) {
    console.log("Server fail to start :", error);
  }
};

module.exports = startApp;
