const authRoute = require("./auth");
const googleIntegrationRoute = require("./integrations/googleIntegrationRoute");
const githubIntegrationRoute=require("./integrations/githubIntegrationRoute");
const linkedinIntegrationRoute = require("./integrations/LinkedinIntegrationRoute");
const { postShare }  = require("../controllers/linkedin/actions")

module.exports = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/integration/auth/google", googleIntegrationRoute);
  app.use("/api/v1/integration/auth/github",githubIntegrationRoute);
  app.use("/api/v1/integration/auth/linkedin",linkedinIntegrationRoute);
  app.use("/api/v1/linkedin/actions",postShare);
};
