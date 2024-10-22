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
  gituserName:{type:String},
  avatar: { type: String },
  email: { type: String, unique: true},
  accountId: { type: String, required: true },
  accessToken: { type: String, required: true },
  webhooks: [
    {
      repoId: { type: String, required: true }, // GitHub repo ID
      repoName: { type: String, required: true },
      webhookId: { type: String }, // ID assigned by GitHub
      events: [{ type: String }], // Events the webhook is subscribed to (e.g., 'push', 'pull_request')
      active: { type: Boolean, default: true },
    },
  ],

});

const Github = mongoose.model("github", githubAccountSchema);
exports.Github = Github;
