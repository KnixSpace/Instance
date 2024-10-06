const {
    register,
    callback,
  } = require("../../controllers/appIntegrations/linkedinIntegrationController");
  
  const router = require("express").Router();

router.get("/register", register);
router.get("/callback", callback);

module.exports = router;