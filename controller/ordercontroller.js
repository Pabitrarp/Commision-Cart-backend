const ordrmodel= require("../models/ordersmodel.js");
const user=require("../models/usermodel.js")
const razorpayintance=require("../config/Razorpay.js")

const Payment=require("../models/paymentlogs.js");
const crypto = require("crypto");
const usermodel = require("../models/usermodel.js");

//get all order//
const getall_orders_of_user=async(req,res)=>{
    const {User} =req.body;
    
    try{
      if(User){
      const orders=await ordrmodel.find({user_id:User?.id})
      res.status(200).json({orders});
      }
    }catch(error){
        console.log(error.message);
    }
}

const createorder = async (req, res) => {
    const {amount}=req.body
    
    try {
     const order=await razorpayintance.orders.create({amount:amount*100,currency:"INR"})
    
        const newOrder = new ordrmodel({
           
            razorpay_order_id:order.id,
        });
        // Save the order to the database
        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.log("Error adding order:", error);
        res.status(500).json({ message: "An error occurred while adding the order." });
    }
};

const veryfyPayment=async(req,res)=>{
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id,
            products,add,amount } = req.body;
    
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest("hex");
  
        if (expectedSignature === razorpay_signature) {
          // Save payment details
          const payment = new Payment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "completed",
            user_id:id,
            order_id:razorpay_order_id,
          
          });
          await payment.save();
          await ordrmodel.findOneAndUpdate(
            { razorpay_order_id },
           {$set:{ payment_status: "completed" ,user_id:id,products,address:add, total_amount: amount,}}
          );
          
          const user = await usermodel.findOne({ _id: id }).populate("parentid");
      if (user?.parentid) {
      
        const parent =await usermodel.findById(user.parentid);
        parent.commision += 50;
        await parent.save();
        

        // Distribute commission to higher levels
        await distributeCommission(parent?.parentid);
      }
         res.status(201).json({success:true,massage:"veryfy"});
        } else {
          res.status(400).json({ success: false, message: "Invalid signature!" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
      }
}
 //distribute commision//
 const distributeCommission = async (id) => {
    if (!id) return; // Base case: No parent to distribute to
      
    try {
      console.log("parent");
      const currentUser = await usermodel.findById(id);
      if (!currentUser) return; 
      currentUser.commision += 10; 
      await currentUser.save(); 
      await distributeCommission(currentUser.parentid);
    } catch (error) {
      console.error("Error distributing commission:", error);
    }
  };
module.exports={getall_orders_of_user,createorder,veryfyPayment}