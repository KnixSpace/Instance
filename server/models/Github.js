const mongoose = require("mongoose");

const githubAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Integration",
    required: true,
  },
  avatar: { type: String },
  email: { type: String, unique: true},
  accountId: { type: String, required: true },
  accessToken: { type: String, required: true },
});

const Github = mongoose.model("github", githubAccountSchema);
exports.Github = Github;
