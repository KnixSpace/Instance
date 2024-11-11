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
    successRedirect: process.env.CLIENT_BASE_URL,
    failureRedirect: "/login",
    session: true,
  })
);

router.get("/data", (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("Not Authorized");
  }
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.redirect(process.env.CLIENT_BASE_URL);
  });
});

router.get("/check", (req, res) => {
  if (req.user) {
    res.status(200).json({ isAuthenticated: true });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

module.exports = router;
