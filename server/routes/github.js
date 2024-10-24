const { register, callback } = require("../controllers/github/auth");
const { getRepoDetails } = require("../controllers/github/services");
const {
  createWebhook,
  handleWebhookEvent,
} = require("../controllers/github/triggers");

const router = require("express").Router();

router.get("/integration/register", register);
router.get("/integration/callback", callback);
router.post("/webhooks", createWebhook);
router.post("/webhookInfo", handleWebhookEvent);
router.post("/repos", getRepoDetails);
module.exports = router;
