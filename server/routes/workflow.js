const {
  createWorkflow,
  fetchServiceAccount,
  updateWorkflow,
  updateMetaData,
  updateStatus,
  getAllWorkflows,
  getWorkflow,
  existWorkflow,
} = require("../controllers/workflowController");
const router = require("express").Router();

router.post("/create", createWorkflow);
router.post("/fetchServiceAccount", fetchServiceAccount);
router.put("/updateWorkflow", updateWorkflow);
router.patch("/updateStatus", updateStatus);
router.post("/getAllWorkflows", getAllWorkflows);
router.post("/getWorkflow", getWorkflow);
router.patch("/updateMetaData", updateMetaData);
router.get("/existWorkflow/:workflowId", existWorkflow);

module.exports = router;
