const startApp = require("./app");

const PORT = process.env.PORT || 3000;

const initializeServer = async () => {
  const app = await startApp();

  if (app) {
    //server test route
    app.get("/", (req, res) => {
      res.send("Instance is running perfectly.");
    });

    //server connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

initializeServer();
