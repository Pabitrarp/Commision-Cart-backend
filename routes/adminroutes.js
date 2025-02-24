const router = require("express").Router()
const admincontroller=require("../controller/admincontroller")
// router.post("/signup",admincontroller.signup)
router.post("/signin",admincontroller.signin);
router.get("/alldata",admincontroller.dashboard);
router.get("/alluser",admincontroller.alluser);
router.get("/allcompliteorder",admincontroller.infoallorder);
router.put("/updatepaymentstatus",admincontroller.paymentverifyandupdateorderstatus);
module.exports=router;