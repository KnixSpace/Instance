const mongoose = require("mongoose");

const slackAccountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    integrationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Integration",
        required: true,
    },

    avatar:{type:String},
    name: { type: String, required: true },
    accountId: {type:String,required:true},
    accessToken:{type:String,required:true},
    email:{type: String, unique: true, required: true }

});

const Slack = mongoose.model("slack",slackAccountSchema);
exports.Slack = Slack;