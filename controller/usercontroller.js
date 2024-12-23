require('dotenv').config()
const usermodel = require("../models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const addressmodel=require("../models/address")
async function addpeople(userid) {
  try {
    let currentuser = await usermodel.findOne({ _id: userid });
    while (currentuser.leftrefer) {
      currentuser = await usermodel.findOne({ _id: currentuser.leftrefer });
    }
    return currentuser;
  } catch (error) {
    console.error("Error in addpeople:", error);
    throw error;
  }
}
/////genarete referid///
const genaretereferid=async()=>{
  let referid="";
  let char="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  for(i=0;i<6;i++){
    referid+=char.charAt(Math.floor(Math.random()*char.length))
  }
    
  return referid;
}

////usersignup////
const signup = async (req, res) => {
  const { Userdetails } = req.body;
  try {
    //check userexits//
    
    const userexits = await usermodel.findOne({ email: Userdetails.Email,phone:Userdetails.Number });
    if (userexits) {
      res.status(201).json({ message: "user exits" });
    }
      
    else {
      ////create user dosenot have referalid///
      const userreferid =await  genaretereferid();  
      if (!Userdetails.Referalid) {
        const user = await usermodel.create({ name: Userdetails.Name, email: Userdetails.Email, password: Userdetails.Password, phone: Userdetails.Number,referId:userreferid})
        const token=jwt.sign({Email:Userdetails.Email,Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
        res.status(200).json({ message: "user created succesfully" ,token,user})
      }
      else {
        const parent = await usermodel.findOne({ referId: Userdetails.Referalid });
        if(!parent){
          res.status(404).json({ message: "wrong referalid",})
          return;
        }
        if (!parent.leftrefer) {
          const user = await usermodel.create({ name: Userdetails.Name, email: Userdetails.Email, password: Userdetails.Password, phone: Userdetails.Number, parentid: parent._id,referId:userreferid })
          const token=jwt.sign({Email:Userdetails.Email,Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
          parent.leftrefer = user._id;
          parent.referearn+=25;
          await parent.save();
          res.status(200).json({ message: "user created succesfully" ,token,user})
        }
        else if (!parent.rightrefer) {
          const user = await usermodel.create({ name: Userdetails.Name, email: Userdetails.Email, password: Userdetails.Password, phone: Userdetails.Number, parentid: parent._id,referId:userreferid})
          const token=jwt.sign({Email:Userdetails.Email,Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
          parent.rightrefer = user._id;
          parent.referearn+=25;
          await parent.save();
          res.status(200).json({ message: "user created succesfully",token ,user})
        }
        else{
          const currentuser= await addpeople(parent.leftrefer);
          const user = await usermodel.create({ name: Userdetails.Name, email: Userdetails.Email, password: Userdetails.Password, phone: Userdetails.Number, parentid: parent._id,referId:userreferid })
          const token=jwt.sign({Email:Userdetails.Email,Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
          currentuser.leftrefer=user._id;
          await currentuser.save();
          parent.referearn+=25;
          await parent.save();
          res.status(200).json({ message: "user created succesfully",token,user})
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
};

// signinuser///
const signin = async (req, res) => {
  try {
    const { Userdetails} = req.body;
    const user = await usermodel.findOne({phone:Userdetails.Number,password:Userdetails.Password});
    if (user) {
      const token=jwt.sign({Email:user.email,Phone:Userdetails.Number,id:user._id},process.env.SECREATE_KEY)
        res.status(200).json({ massege: "signin successfully", token });
      } else {
        res.status(401).json({massege:"invalid credential"});
      }
    
  } catch (err) {
    console.log(err);
  }
}
//get all user///
const alluser = async (req, res) => {
  try {
    const users = await usermodel.findOne({ email: 'pabitramoharan@gmil.com' }).populate({ path: 'usertorefer', select: 'name email' });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
 
// get  profile data//
const getuser=async(req,res)=>{
  try {
    const {userid}=req.body;
    
    const user=await usermodel.findOne({_id:userid});
    if(user?.leftrefer==null){
      res.status(200).json({message:"user fetch successfully",user})
    }
    else{
      
      const referralTree = await buildReferralTree(user._id);
      res.status(200).json({referralTree,user});
    }
  } catch (error) {
    console.log(error)
  }
}
////for tree//
async function buildReferralTree(id) {
  try {
    // Fetch the current user
    const user = await usermodel.findOne({ _id: id });

    if (!user) return null; // If user doesn't exist, return null

    // Recursively fetch the left and right referral trees
    const leftTree = user.leftrefer ? await buildReferralTree(user.leftrefer) : null;
    const rightTree = user.rightrefer ? await buildReferralTree(user.rightrefer) : null;

    // Return the current user with its children
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      referId: user.referId,
      referearn: user.referearn,
      left: leftTree,  // Left subtree
      right: rightTree // Right subtree
    };
  } catch (error) {
    console.error("Error in buildReferralTree:", error);
    throw error;
  }
}

const addaddres=async(req,res)=>{
   const {Userdetails}=req.body;
   
   try {
    const address=await addressmodel.create({name:Userdetails.AddressName,city:Userdetails.City,landmark:Userdetails.Landmark,pincode:Userdetails.PIN,user_id:Userdetails.id});
    const user=await usermodel.findByIdAndUpdate(Userdetails.id,{$push:{address:address._id}})
    res.status(201).json({massage:"succesfuly add address"});
   } 
   catch (error) {
    console.log(error);
    res.status(500).json({massgage:"server error"})
   }
}
const getaddres=async(req,res)=>{
   const {User}=req.body;
 
   try {
    if(User){
    const address=await addressmodel.find({user_id:User.id}).limit(4) 
    res.status(201).json({message:"succesfuly fetch address",address});
    }
   } 
   catch (error) {
    console.log(error);
    res.status(500).json({massgage:"server error"}) 
  
   }
}
const removeadd=async(req,res)=>{
  const {id,User}=req.body;
   try {
      const removeuseradd=await usermodel.updateOne({_id:User.id},{$pull:{address:id}});
      const removeadd=await addressmodel.deleteOne({_id:id});
      

   } catch (error) {
    console.log(error)
    res.status(500).json({massgage:"server error"}) 
   }
}
 const userwallet=async(req,res)=>
 {
  const {User}=req.body;
  try {
    const data=await usermodel.findOne({_id:User.id});
    res.status(200).json({data});
  } catch (error) {
     console.log(error);
     res.status(500).json({error:error.message})
  }
 }

module.exports = { signup, signin, alluser,getuser,addaddres,getaddres,removeadd,userwallet};        