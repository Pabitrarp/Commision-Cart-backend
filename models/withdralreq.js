const mongoose=require("mongoose");

const withdral=mongoose.Schema({
    user:{
       user_id:{type:mongoose.Types.ObjectId},
       referammount:{type:Number},
       commisionammount:{type:Number},
       email:{type:String},
    },
    commisionammount:{
        type:Number,
    },
    referammount:{
        type:Number,
    },
    upi:{
        type:String,
    }
});
module.exports =mongoose.model("withdralreq",withdral);
