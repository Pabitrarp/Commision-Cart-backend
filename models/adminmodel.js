const mongoose=require("mongoose")
const adminschma=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
       type:Number,
       required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true,versionKey:false});
module.exports=mongoose.model("admins",adminschma);

