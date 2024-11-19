const {register,callback} = require("../controllers/slack/auth");
const{createChannel} = require('../controllers/slack/action')
const router = require("express").Router();

router.get("/integration/register",register);
router.get("/integration/callback",callback);
router.get("/createChannel",createChannel); 

module.exports = router;