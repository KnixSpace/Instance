const mongoose = require("mongoose");
const {startChangeStream} = require("../engine/scheduler");

const connectDB = async () => {
  try {
    
    mongoose.connection.once('open', async() => {
      // console.error("MongoDB error:");
      startChangeStream();
    });

    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected on ${mongoose.connection.host}`);

  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }

};
module.exports = connectDB;
