const express=require("express");
const ordercontroller=require("../controller/ordercontroller");
const router=express.Router();
  router.post("/getallorders",ordercontroller.getall_orders_of_user)
  router.post("/addproducts",ordercontroller.createorder)
  router.post("/veryfypayment",ordercontroller.veryfyPayment)
module.exports=router;