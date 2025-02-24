const adminmodel=require("../models/adminmodel")
const jwt =require("jsonwebtoken");
const usermodel = require("../models/usermodel");
const ordermodels = require("../models/ordersmodel");
const { set } = require("mongoose");
const signin = async (req, res) => {
const ordermodel=require("../models/ordersmodel")
 try {
     const { Userdetails} = req.body;
     const user = await adminmodel.findOne({phone:Userdetails.Number,password:Userdetails.Password});
     
     if (user) {
       const token=jwt.sign({Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
         res.status(200).json({ massege: "signin successfully", token });
       } else {
         res.status(401).json({massege:"invalid credential"});
       }
     
   } catch (error) {
     console.log(error);
   }
 }

 const dashboard=async(req,res)=>{
    try {
    const dashboarddata=await usermodel.aggregate([
      {
        $facet:{
            usercount:[{$count:'count'}],
            orders:
               [ {
                    $unionWith:'orders',
                    
                },
                {
                    $count:"count"
                }],
            products:
               [ {
                    $unionWith:'products',
                    
                },
                {
                    $count:"count"
                }],
            
            catagory:
               [ {
                    $unionWith:'catagorys',
                    
                },
                {
                    $count:"count"
                }]
            

        }}
      ,{
        $project:{
             user:{$arrayElemAt:["$usercount.count",0]},
             order:{$arrayElemAt:["$orders.count",0]},
             products:{$arrayElemAt:["$products.count",0]},
             catagory:{$arrayElemAt:["$catagory.count",0]},
        }
      }
    ])
   res.status(200).json({dashboarddata});
    } catch (error) {
     console.log(error) 
     res.status(500).json({message:" internal server error"});  
    }
 }
 const alluser=async(req,res)=>{
    try {
         const user=await usermodel.find().populate("address");
       res.status(200).json(user);
    } catch (error) {
      console.log(error)   
      res.status(500).json({message:"internal server error"})
    }
 }

 const infoallorder=async(req,res)=>{
    try {
      const order=await ordermodels.aggregate([
        // {
        //   $match:{
        //     payment_status:'completed'
        //   }
        // },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdata",
        }
        },{
          $unwind:{
            path:"$userdata"
          }
        },
        {
            $lookup:{
              from:"addres",
              localField:"address",
              foreignField:"_id",
              as:"address"
            }
        },{
         $unwind:
          {path:"$address"}
        }
      ])
  res.status(200).json(order)
  
  
    } catch (error) {
      console.log(error)
    }
  }

/////distributes////
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
const paymentverifyandupdateorderstatus =async(req,res)=>{
  try {
    const {id}=req.body;
    const order=await ordermodels.findByIdAndUpdate(id,{$set:{payment_status:"Verify",orderstatus:"Ready to print"}})

    const user = await usermodel.findOne({ _id: order.user_id })
    if (user?.parentid) {
      
      const parent =await usermodel.findById(user.parentid);
      parent.commision += 50;
      await parent.save();
      
      await distributeCommission(parent?.parentid);
    }
    res.status(200).json({message:"Payment verify",user})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"internal server error"});
  }
}


module.exports={signin,dashboard,alluser,infoallorder,paymentverifyandupdateorderstatus}