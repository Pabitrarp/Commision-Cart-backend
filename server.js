const mongoose=require("mongoose");
const express=require("express");
const path=require("path");
const usermodel=require("./models/usermodel.js")
const userrouter=require("./routes/userroutes");
const productsroute=require("./routes/productsroutes")
const catagory=require('./models/catagorymodel');
const orderroute=require("./routes/orderroutes.js")
const adminroute=require("./routes/adminroutes.js")
const cors = require('cors');
const adminmodel = require("./models/adminmodel.js");
 const products=require("./models/productsmodel.js")
const app=express();
app.use(express.json()); 
app.use(cors());
const db=async()=>{
    try{
    await mongoose.connect("mongodb+srv://Pabi:Pabi1234@user.zjsm9hu.mongodb.net/teaapp?retryWrites=true&w=majority&appName=user");
        console.log("connected");
         in_it();
       await usermodel.updateMany({},{$set:{isActive:false}});
       await products.updateMany({},{$set:{firstcommision:0,restofcommision:0,stuck:0}}); 
       
    }catch(err){
        console.log(err)
    } 
} 
db();
const in_it=async()=>{
    try {
        const admin=await adminmodel.findOne({phone:8144216354})
        if(admin){
            console.log("adminexits");
        }
     else{
        const admin=new adminmodel({name:"adminpabi",phone:8144216354,password:'admin@123'}) 
        await admin.save();
        console.log("admincreated");
     }
   
    } catch (error) {
        console.log(error)
    }
}

app.use((req,res,next)=>{
    const currenttime= new Date().toLocaleString('en-US',{hour:'numeric',minute:'numeric',second:'numeric',hour12:true,year:'numeric',month:'2-digit',day:'2-digit'});
    console.log(`${currenttime}: method: ${req.method} / url: ${req.url}`)
    next();
})
app.use("/api/v1/user/",userrouter);
app.use("/api/v1/admin/",adminroute);
app.use("/api/v1/products/",productsroute);
app.use("/api/v1/",orderroute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/",(req,res)=>{
    res.send("server runing");
}).listen(8000,()=>{
    console.log("8000 runing");
})
