const authRoute = require("./auth");
const googleRoutes = require("./google");
const githubRoutes = require("./github");
const linkedinRoutes = require("./linkedin");
const workflowRoute = require("./workflow");

module.exports = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/google", googleRoutes);
  app.use("/api/v1/github", githubRoutes);
  app.use("/api/v1/linkedin", linkedinRoutes);
  app.use("/api/v1/workflow", workflowRoute);
};
