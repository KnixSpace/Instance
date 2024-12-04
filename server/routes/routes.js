const authRoute = require("./auth");
const googleRoutes = require("./google");
const githubRoutes = require("./github");
const linkedinRoutes = require("./linkedin");
const notionRoutes = require("./notion");
const slackRoutes = require("./slack");
const workflowRoute = require("./workflow");

module.exports = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/google", googleRoutes);
  app.use("/api/v1/github", githubRoutes);
  app.use("/api/v1/linkedin", linkedinRoutes);
  app.use("/api/v1/notion", notionRoutes);
  app.use("/api/v1/slack", slackRoutes);
  app.use("/api/v1/workflow", workflowRoute);
};
 