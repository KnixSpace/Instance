const mongoose = require("mongoose")

const linkedinAccountSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true, 
    },
    intigrationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Integration",
        required: true,
    },
    avatar: { type: String },
    email: { type: String, unique: true, required: true },
    accountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
});

const Linkedin = mongoose.model("linkedin",linkedinAccountSchema);
exports.LinkedIn = Linkedin;