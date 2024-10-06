require("dotenv").config();
require("./passport");
const express = require("express");
const errorHandler = require("../middlewares/errorHandler");
const setupMiddleware = require("../middlewares/setupMiddleware");
const routes = require("../routes/routes");
const app = express();

//setup middleware
setupMiddleware(app);

//routes
routes(app);

//error handling Middleware
app.use(errorHandler);

module.exports = app;
