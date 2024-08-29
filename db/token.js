const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users",
        unique:true
    },
    token:{
        type:String,
        required:true
    }
})

const Token = mongoose.model("tokens",tokenSchema);
module.exports = Token;