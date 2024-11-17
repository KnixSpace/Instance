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
      enum: ["google", "slack", "linkedin", "github", "notion"],
      required: true,
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "provider",
      },
    ],
  },
  { timestamps: true }
);

const Integration = mongoose.model("integration", integrationSchema);

exports.Integration = Integration;
