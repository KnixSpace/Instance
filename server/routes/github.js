const { register, callback } = require("../controllers/github/auth");
const { getRepoDetails } = require("../controllers/github/services");
const {
  createWebhook,
  handleWebhookEvent,
} = require("../controllers/github/triggers");

const router = require("express").Router();

//auth
router.post("/integration/register", register);
router.get("/integration/callback", callback);

//services
router.post("/service/getRepos", getRepoDetails);

//trigger notifications
router.post("/webhook/notifications", handleWebhookEvent);
module.exports = router;
