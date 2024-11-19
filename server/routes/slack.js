const {register,callback} = require("../controllers/slack/auth");
const{createChannel,getChannelList,sendMessage} = require('../controllers/slack/action')
const router = require("express").Router();

router.get("/integration/register",register);
router.get("/integration/callback",callback);
router.get("/createChannel",createChannel); 
router.get("/getChanelList",getChannelList); 
router.get("/sendMessage",sendMessage);
module.exports = router;