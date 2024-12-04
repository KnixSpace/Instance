const {register,callback} = require("../controllers/slack/auth");
const router = require("express").Router();
router.post("/integration/register",register);
router.get("/integration/callback",callback);

module.exports = router;