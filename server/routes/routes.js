const authRoute = require("./auth");
const googleIntegrationRoute = require("./integrations/googleIntegrationRoute");

module.exports = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/integration/auth/google", googleIntegrationRoute);
};
