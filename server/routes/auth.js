const router = require("express").Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
    session: true,
  })
);

module.exports = router;
