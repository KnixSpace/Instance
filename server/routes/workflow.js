const { createWorkflow } = require("../controllers/workflowController");

const router = require("express").Router();

router.post("/create", createWorkflow);

module.exports = router;
