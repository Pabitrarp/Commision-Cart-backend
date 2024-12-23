
const mongoose=require("mongoose")

const addresschema=new mongoose.Schema({
    name:{type:String,default:"Home"},
    city:{type:String,require:true},
    pincode:{type:String,require:true},
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'users'},
    landmark:{type:String}
},{timestamps:true,versionKey:false,});

module.exports= mongoose.model("addres",addresschema);