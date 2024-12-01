const {register,callback} = require("../controllers/notion/auth");
const router = require("express").Router();

router.post("/integration/register",register);
router.get("/integration/callback",callback);

module.exports = router; 