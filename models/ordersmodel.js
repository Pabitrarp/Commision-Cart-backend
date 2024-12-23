const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    orderstatus: {type:String,default:"Placed"}, 
    total_amount: Number, 
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users" 
    },
    products: [{ 
        type: Object, 
        
    }],
  razorpay_order_id: {
        type: String, 
        requied:true,
    },
    payment_status: {type:String,default:"Pending"},
    address:{type:mongoose.Schema.Types.ObjectId,ref:"addres"} 
}, { timestamps: true, versionKey: false }); 

const ordermodels = mongoose.model("orders", ordersSchema); 
module.exports = ordermodels;  
 