const {
    register,
    callback,
} = require("../../controllers/appIntegrations/githubIntegrationController");
const { getRepoDetails } = require("../../controllers/github/services");
const { createWebhook, handleWebhookEvent } = require("../../controllers/github/triggers");

const router = require("express").Router();

router.get("/register", register);
router.get("/callback", callback);
router.post("/webhooks", createWebhook);
router.post("/webhookInfo", handleWebhookEvent);
router.post("/repos", getRepoDetails);
module.exports = router;