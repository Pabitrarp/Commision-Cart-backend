const mongoose =require("mongoose")

const categoryschema=mongoose.Schema({
    Name:{
       type:String,
       require:true
    },
    image:{
       type:String,
       require:true
    }
},{timestamps:true,versionKey:false})
module.exports=mongoose.model("catagorys",categoryschema);
