const { register, callback } = require("../controllers/google/auth");
const { getDriveFiles,getAllSpreadsheetSheets} = require("../controllers/google/service");

const router = require("express").Router();

//auth
router.post("/integration/register", register);
router.get("/integration/callback", callback);

//service
router.post("/integration/service/getDriveFiles", getDriveFiles);
router.post("/integration/service/getSheetNames", getAllSpreadsheetSheets);

module.exports = router;
