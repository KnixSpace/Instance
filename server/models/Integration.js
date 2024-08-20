const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["google", "slack", "linkedin", "github"],
      required: true,
    },
    accounts: [
      {
        avatar: { type: String },
        email: { type: String },
        accountId: { type: String },
        accessToken: { type: String, required: true },
        refreshToken: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Integration = mongoose.model("integration", integrationSchema);

exports.Integration = Integration;
