require("dotenv").config();
require("./passport");

const { googleIntegration,linkedinIntegration,shareOnlinkedin } = require("../integrations");

const authRoute = require("../routes/auth");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

//Middleware (bodyParser, CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      domain: process.env.NODE_ENV === "development" ? "localhost" : "auto",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", authRoute);

//integrations
app.use("/integration/auth/google", googleIntegration);
app.use("/integration/auth/linkedin",linkedinIntegration);
//Error handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Handle specific error types
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Unauthorized" });
  } else if (err.name === "NotFoundError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  // Generic error handling
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
