const mongoose = require("mongoose")

const notionAccountSchema = new mongoose.Schema({
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
    name: { type: String, required: true },
    avatar:{type:String},
    accountId: {type:String,required:true},
    accessToken:{type:String,required:true}
    
}); 

const Notion = mongoose.model("notion",notionAccountSchema);
exports.Notion = Notion;