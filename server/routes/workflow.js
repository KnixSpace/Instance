const { createWorkflow, fetchServiceAccount, updateWorkflow, statusUpdate, getWorkflowSummary, getWorkflowdetails, updateMetaData } = require("../controllers/workflowController");
const router = require("express").Router();

router.post("/create", createWorkflow);
router.post("/fetchServiceAccount", fetchServiceAccount);
router.put("/updateWorkflow", updateWorkflow);
router.patch("/statusUpdate", statusUpdate);
router.post("/getDescription", getWorkflowSummary);
router.post("/getWorkflows", getWorkflowdetails);
router.patch("/updateMetaData", updateMetaData);

module.exports = router;
