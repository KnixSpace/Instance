const { createWorkflow, fetchServiceAccount, updateWorkflow } = require("../controllers/workflowController");

const router = require("express").Router();

router.post("/create", createWorkflow);
router.post("/fetchServiceAccount", fetchServiceAccount);
router.post("/updateWorkflow", updateWorkflow);

module.exports = router;
