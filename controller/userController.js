const userCollection = require('../model/userModel')
const turfCollection= require('../model/turfModel')
const bookingCollection = require('../model/bookingModel')
const chatCollection=require('../model/chatModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const cloudinary = require('../helpers/Cloudinary')
require('dotenv').config()
require('mongodb');
require('mongoose');

///<<<<<<<<<<<<<<<<<<<<<<<< Login User Data  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const userData = async (req, res) => {
  try {
    const userID = req.UserId;
    const data = await userCollection.findById(userID);    
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }  
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< USER LOGIN  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email == '' || password=='') {
          return res.status(400).json({message:'Empty Field'});
        }
        else if (email === undefined) {
            return res.status(400).json({message:'Email required'});
        } else if (password === undefined) {
            return res.status(400).json({ message:'Password required'});
        }       
        const user = await userCollection.findOne({ email: email });      
        if (!user) {
            return res.status(401).json({message:'Incorrect email'});
        }  
        if (user?.isBlock) {
          return res.status(403).json({ message: 'you are blocked' });
      } 
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ message:'Incorrect password'});
        }      
        const token = jwt.sign({ id: user._id }, process.env.USER_TOKEN_SECRET, { expiresIn: '3d' });
        res.json({ login: true, token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

///<<<<<<<<<<<<<<<<<<<<<<<< USER SIGNUP >>>>>>>>>>>>>>>>>>>>>>>>>>>
let userdata 
const userSignup = async (req, res) => {
  try {
  let { username, phonenumber, email, password } = req.body;
  userdata = {
    username: username,
    phonenumber: phonenumber,
    email: email,
    password: password
  }
  const checkusername = await userCollection.find({ email: email });
  
  if (checkusername.length > 0) {
    const errors = { email: 'email already exists' };
    return res.json({ errors, created: false });
  }
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^\+\d{1,3}-\d{3,14}$/;
  
  if (!usernameRegex.test(username)) {
    const errors = { username: 'Enter a valid username' };
    return res.json({ errors, created: false });
  } 
  if (!passwordRegex.test(password)) {
    const errors = { password: 'Enter a valid password' };
    return res.json({ errors, created: false });
  } 
  if (!emailRegex.test(email)) {
    const errors = { email: 'Enter a valid email' };
    return res.json({ errors, created: false });
  }
  else{  
    const otp= { checkotp: 'Enter a otp' }   
    res.json({ otp, created: false });
    await otpcheck(userdata);    
  }  
  } catch (error) {
    return res.status(500).json({error, message: "Internal server error" });
  }
};

//<<<<<<<<<<<<<<  WHEN USER SIGNUP OTP PAGE APPEAR AND THIS FUNCTION WORKS >>>>>>>>>>
let OtpCode;
const otpcheck = async function (req, res, next) {
   try {
    OtpCode = Math.floor(100000 + Math.random() * 988800)
    otp = OtpCode
    otpEmail = userdata.email
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMailer_Mail,
        pass: process.env.NodeMailer_Password,      
      }
    })
    let docs = {
      from: "AoneTurf@gmail.com",
      to: otpEmail,
      subject: "A one Turf Varification",
      html: `<p style="font-size:24px;font-weight:bold;">${OtpCode}</p><p> A one Turf verification code, Do not share with others</p>`  
    }
    mailTransporter.sendMail(docs, (err) => {
      if (err) {
        console.log(err)
      }
    })
   } catch (error) {
    return res.status(500).json({error, message: "Internal server error" });
   }
}

///<<<<<<<<<<<<<<<<<<<<<<<< SUBMIT BUTTON OF OTP PAGE  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const otpSubmit = async function (req, res, next) {
  try {
    const {otp}=req.body
    if (OtpCode == otp) {
      let {username, phonenumber, password, email  }= userdata
       password = password ? await bcrypt.hash(password, 10) : null;
       const data = await userCollection.insertMany([{ username, phonenumber, password, email }]);
       res.json({ user: data, created: true });
    }
    else {
      const errors= "Wrong Otp"
      res.json({ errors, created: false });
    }
  } catch (error) {
    return res.status(500).json({error, message: "Internal server error" });
  }
}

///<<<<<<<<<<<<<<<<<<<<<<<< RESEND OTP   >>>>>>>>>>>>>>>>>>>>>>>>>>>
const resendOtp = async function (req, res, next) {
  try {
    const otp= { checkotp: 'Enter a otp' }  
    res.json({otp});
    await otpcheck();  
  } catch (error) {   
    return res.status(500).json({ message: "Internal server error" });
  } 
}

///<<<<<<<<<<<<<<<<<<<<<<<< USER PROFILE PHOTO UPLOAD  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const photoUpload = async (req, res, next) => {
  try {
    const userId = req.UserId;
    const result = await cloudinary.uploader.upload(req.file.path);
    await userCollection.updateOne(
      { _id: userId },
      { $set: { image: result.secure_url } }
    );
    res.status(200).json({ status: true, imageurl: result.secure_url });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error uploading photo" });
  }
};


///<<<<<<<<<<<<<<<<<<<<<<<< USER PROFILE DATA UPDATE  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const userProfile = async (req, res, next) => {
  try {
    const userId = req.UserId;
    let { username, address } = req.body;
    const data = await userCollection.findByIdAndUpdate(
      { _id: userId },
      { $set: { address: address, username: username } }
    );
    res.json({ status: true, data });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< TURF GET FUNCTION    >>>>>>>>>>>>>>>>>>>>>>>>>>>
const AllturfView = async (req, res) => {
  try {
    const data = await turfCollection.find({ isApprove: true })
    if (data && data.length > 0) {
      res.json({ data });
    } else {
      return res.status(404).json({ message: "No approved turfs found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< TURF SINGLE VIEW GET  >>>>>>>>>>>>>>>>>>>>>>>>>>>
 const TurfSingleView = async (req, res) => {
  try {
      const ID = req.params.id;
      const turf = await turfCollection.findById({ _id: ID });
      res.status(200).json({ turf });
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< USER CAN ADD REVIEW POST FUNCTION   >>>>>>>>>>>>>>>>>>>>>>>>>>>
const reviewSubmit = async (req, res) => {
  try {
      const userId=req.UserId
      const { turfId, review, rating } = req.body;     
      const turf = await turfCollection.findById({ _id: turfId });
      turf.reviews.push({userId,review,rating});
      const ratings = turf.reviews.map((review) => review.rating);
      const averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
      turf.rating = averageRating;
      await turf.save();
      res.status(200).json(turf);
  }
  catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
}

///<<<<<<<<<<<<<<<<<<<<<<<< GET RURF REVIEWS FUNCTION >>>>>>>>>>>>>>>>>>>>>>>>>>>
const getReviews = async (req, res) => {
  try {
      const turfId = req.params.id
      const reviews = await turfCollection.findById({ _id: turfId }).populate('reviews.userId')
      res.status(200).json({ reviews:reviews.reviews.reverse() })
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
}

 ///<<<<<<<<<<<<<<<<<<<<<<<< GET CHAT MESSAGE OF USER >>>>>>>>>>>>>>>>>>>>>>>>>>>
const getMessages = async (req, res) => {
  try {
    const userId = req.UserId;
    const messages = await chatCollection.find({ userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< USER CHAT POST METHOD HERE  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const AddMessages = async (req, res) => {
  try {
    const { sender, content } = req.body;
    const userId = req.UserId;
    const newMessage = new chatCollection({ userId, sender, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  userSignup,
  userLogin,
  userProfile, 
  AllturfView, 
  TurfSingleView,
  otpSubmit,
  resendOtp , 
  userData,
  photoUpload,
  reviewSubmit,
  getReviews,
  getMessages,
  AddMessages
}




