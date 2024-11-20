const { register, callback } = require("../controllers/google/auth");
const {
  getDriveFiles,
  getSheetNames,
} = require("../controllers/google/services");

const router = require("express").Router();

//auth
router.post("/integration/register", register);
router.get("/integration/callback", callback);

//service
router.post("/service/getDriveFiles", getDriveFiles);
router.post("/service/getSheetNames", getSheetNames);

module.exports = router;
