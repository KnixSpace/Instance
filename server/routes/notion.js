const {register,callback} = require("../controllers/notion/auth");
const {getPages,addContent} = require("../controllers/notion/action");
const router = require("express").Router();

router.get("/integration/register",register);
router.get("/integration/callback",callback);
router.get("/getpages",getPages);
router.get("/addContent",addContent);
module.exports = router;