const express=require("express");
const ordercontroller=require("../controller/ordercontroller");
const { upload } = require("../middlewares/multer");
const router=express.Router();
  router.post("/getallorders",ordercontroller.getall_orders_of_user)
  router.post("/addproducts",ordercontroller.createorder)
  router.post("/veryfypayment",ordercontroller.veryfyPayment)
  router.post("/createorder",upload.single('paymentproof'),ordercontroller.createorderforscanner)
module.exports=router;