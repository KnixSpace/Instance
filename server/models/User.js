const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    integrations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Integration" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
exports.User = User;
