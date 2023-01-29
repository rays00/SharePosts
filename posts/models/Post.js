const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    title: {
      type:String,
      required:true
    },
    description: {
      type:String,
      required:true
    },
    time : { type : Date, default: Date.now }
});
module.exports = Post = mongoose.model("post", PostSchema);