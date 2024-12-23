const mongoose=require("mongoose");

const paymentschema=new mongoose.Schema({
  razorpay_order_id:{type:String,require:true},
  razorpay_payment_id:{type:String},
  razorpay_signature:{type:String},
  status:{type:String,default:"Pending"},
  user_id:{type:mongoose.Types.ObjectId,ref:"users"},
  order_id:{type:String}
},{timestamps:true,versionKey:false});

module.exports=mongoose.model("paymentlogs",paymentschema);