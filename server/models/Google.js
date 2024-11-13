const mongoose = require("mongoose");
const googleAccountSchema = new mongoose.Schema(
  {
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
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String, required: true },
    accountId: { type: String, required: true },
    scopes: [{ type: String, required: true }],
    tokens: {
      accessToken: { type: String, required: true },
      refreshToken: { type: String, required: true },
      expiry: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

const Google = mongoose.model("google", googleAccountSchema);
exports.Google = Google;
