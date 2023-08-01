const adminCollection = require("../model/adminModel");
const userCollection = require("../model/userModel");
const partnerCollection = require("../model/partnerModel");
const turfCollection = require("../model/turfModel");
const bookingCollection= require ('../model/bookingModel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// let data = {
//     username: "mohammed",
//     password: "123456"
//   };

//   const signup = async (req, res) => {
//     console.log(data);

//     try {
//       await adminCollection.create(data);
//       console.log("Added");
//       res.status(200).send("Added");
//     } catch (error) {
//       console.error("Error during signup:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   };

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN LOGIN  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const adminLogin = async (req, res) => {
  try {
    let { username, password } = req.body;
    let admin = await adminCollection.findOne({ username });
    if (admin) {
      if (admin.password === password) {
        console.log("Logged in successfully");
        const token = jwt.sign({ sub: admin._id }, process.env.ADMIN_TOKEN_SECRET, { expiresIn: "3d" });
        res.json({ admin: true, token });
      } else {
        console.log("Invalid Password");
        const errors = { username: "Invalid password" };
        res.json({ errors, admin: false });
      }
    } else {
      console.log("Username not found");
      const errors = { username: "Username not found" };
      res.json({ errors, admin: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const userList = async (req, res) => {
  console.log("hello iam user data .......-------");
  const data = await userCollection.find({});
  console.log(data, "user data  ahsddgd");
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
};

const partnerList = async (req, res) => {
  console.log("hello iam user data .......-------");
  const data = await partnerCollection.find({});
  console.log(data, "user data  ahsddgd");
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
};

// ///BLOCKING USER BY ADMIN

const blockUser = async (req, res) => {
  try {
    console.log("hello ia block user -----------ddfdfdd");
    const { userId } = req.body;
    const userData = await userCollection.findOne({ _id: userId });
    console.log(userData, "hello ia block user -----------ddfdfdd");
    if (userData) {
      const data = await userCollection.updateOne(
        { _id: userData._id },
        { $set: { isBlock: true } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "User blocked successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UnBlockUser = async (req, res) => {
  try {
    console.log("hello ia unblock user -----------ddfdfdd");
    const { userId } = req.body;
    const userData = await userCollection.findOne({ _id: userId });
    console.log(userData, "hello ia unblock user -----------ddfdfdd");
    if (userData) {
      const data = await userCollection.updateOne(
        { _id: userData._id },
        { $set: { isBlock: false } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "User blocked successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//APPROVE PARTNER BY ADMIN 
const approvePartner = async (req, res) => {
  try {
    console.log("hello im approvePartner -----------ddfdfdd");
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
    console.log(userData, "approve");
    if (userData) {
      const data = await partnerCollection.updateOne(
        { _id: userData._id },
        { $set: { isApprove: true } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "Manager Approved" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//<<<<<<<<<<<<<<<-----Block partner by admin ------->>>>>>>>>>>>>>>>>>
const blockManager = async (req, res) => {
  try {
    console.log("hello ia block user -----------ddfdfdd");
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
    console.log(userData, "hello ia block user -----------ddfdfdd");
    if (userData) {
      const data = await partnerCollection.updateOne(
        { _id: userData._id },
        { $set: { isBlock: true } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "User blocked successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//<<<<<<<<<<<<<<<-----  UnBlock partner by admin ------->>>>>>>>>>>>>>>>>>
const UnBlockManager = async (req, res) => {
  try {
    console.log("hello ia unblock user -----------ddfdfdd");
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
    console.log(userData, "hello ia unblock user -----------ddfdfdd");
    if (userData) {
      const data = await partnerCollection.updateOne(
        { _id: userData._id },
        { $set: { isBlock: false } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "User blocked successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const TurfList = async (req, res) => {
  // const {userId} = req.body
  const data = await turfCollection.find({});
  console.log(data, "turf data  ahsddgd");
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
};

//APPROVE TURFS BY ADMIN
const approveTurfs = async (req, res) => {
  try {
    console.log("hello im approveturfs-----------ddfdfdd");
    const { userId } = req.body;
    const userData = await turfCollection.findOne({ _id: userId });
    console.log(userData, "approve");
    if (userData) {
      const data = await turfCollection.updateOne(
        { _id: userData._id },
        { $set: { isApprove: true } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "Manager Approved" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const bookingLists = async(req,res)=>{
  const response= await bookingCollection.find({}).populate('turf').populate('user')
  res.status(200).json({response})
}


module.exports = {
  adminLogin,
  userList,
  blockUser,
  UnBlockUser,
  partnerList,
  approvePartner,
  blockManager,
  UnBlockManager,
  TurfList,
  approveTurfs,
  bookingLists
};
