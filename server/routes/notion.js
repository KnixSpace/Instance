const {register,callback} = require("../controllers/notion/auth");
const { getPages} = require("../controllers/notion/service")
const router = require("express").Router();

//auth
router.post("/integration/register",register);
router.get("/integration/callback",callback);

//getPage  
router.post("/integration/getPage",getPages)

module.exports = router;  