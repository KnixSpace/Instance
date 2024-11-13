const { createWorkflow, fetchServiceAccount } = require("../controllers/workflowController");

const router = require("express").Router();

router.post("/create", createWorkflow);
router.post("/fetchServiceAccount", fetchServiceAccount);

module.exports = router;
