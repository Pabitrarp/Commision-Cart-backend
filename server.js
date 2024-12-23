const mongoose=require("mongoose");
const express=require("express");
const path=require("path");
const userrouter=require("./routes/userroutes");
const productsroute=require("./routes/productsroutes")
const catagory=require('./models/catagorymodel');
const orderroute=require("./routes/orderroutes.js")
const cors = require('cors')
const app=express();
app.use(express.json()); 
app.use(cors());
const db=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1/tea");
        console.log("connected");
    }catch(err){
        console.log(err)
    } 
} 
db();

app.use((req,res,next)=>{
    const currenttime= new Date().toLocaleString('en-US',{hour:'numeric',minute:'numeric',second:'numeric',hour12:true,year:'numeric',month:'2-digit',day:'2-digit'});
    console.log(`${currenttime}: method: ${req.method} / url: ${req.url}`)
    next();
})
app.use("/api/v1/user/",userrouter);
app.use("/api/v1/products/",productsroute);
app.use("/api/v1/",orderroute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/",(req,res)=>{
    res.send("server runing");
}).listen(8000,()=>{
    console.log("8000 runing");
})
