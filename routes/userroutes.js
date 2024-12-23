
const express=require("express")
const usercontroller=require("../controller/usercontroller")
const router=express.Router();
router.post("/signup",usercontroller.signup);
router.post("/signin",usercontroller.signin);
router.get("/getalluser",usercontroller.alluser);
router.post("/profile",usercontroller.getuser);
router.post("/addaddress",usercontroller.addaddres);
router.post("/getaddress",usercontroller.getaddres);
router.post("/deleteadd",usercontroller.removeadd);
router.post("/wallet",usercontroller.userwallet);
module.exports=router;