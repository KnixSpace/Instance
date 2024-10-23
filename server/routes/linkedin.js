const { register, callback } = require("../controllers/linkedin/auth");

const router = require("express").Router();

router.get("/integration/register", register);
router.get("/integration/callback", callback);

module.exports = router;
