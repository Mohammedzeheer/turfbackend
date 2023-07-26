const userCollection = require('../model/userModel')
const turfCollection= require('../model/turfModel')
const bookingCollection = require('../model/bookingModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const cloudinary = require('../helpers/Cloudinary')
const dotenv =require('dotenv').config()

// let upload= require('../middleware/photo')

const userHome = (req,res)=>{
    res.send('user home ')
 console.log("hello iam user home ")
}

const userData = async (req,res)=>{
  const ID = req.params.id;
  console.log(ID)
  const data = await userCollection.findById({_id:ID})
  console.log(data , "iam user datas")
  return res.json({data});
}




  //--------User Login Function here --------------------------
const userLogin = async (req,res)=>{
    try{
        console.log("hello iam userlogin")
        const {email,password} = req.body
        const user=await userCollection.findOne({email:email})
        console.log(email);

        if(email===undefined) {
            const errors={email:'email required'}
            res.json({ errors, created: false })
        }

        else if(password===undefined) {
            const errors={email:'Password required'}
            res.json({ errors, created: false })
        }

        else if(user){
            let auth= password ? await bcrypt.compare(password,user.password) : null;
            console.log(auth)
            if(auth){
                const token=jwt.sign({sub:user._id},process.env.TOKEN_SECRET,{expiresIn:'3d'}) //adding topken here
                res.json({login:true,token,user})
            }else{

                const errors={password:"incorrect password"}
                res.json({ errors, created: false })
            }
        }else{
            console.log("error")
            const errors={email:'incorrect email'}
                res.json({ errors, created: false })
        }
    }catch(error){
        console.log(error);
    }
}


//-------------------------------------------new from ol here starting  -------------------------------------------------------------------
let userdata 
const userSignup = async (req, res) => {
  try {
    console.log("hello iam user signup")
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
    res.json({ error, created: false });
  }
};



//<<<<<<<<<<<<<<  WHEN USER SIGNUP OTP PAGE APPEAR AND THIS FUNCTION WORKS >>>>>>>>>>
let OtpCode;
const otpcheck = async function (req, res, next) {
   try {
    console.log(userdata);
    OtpCode = Math.floor(100000 + Math.random() * 988800)
    otp = OtpCode
    otpEmail = userdata.email
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fammsstore11@gmail.com",
        pass: 'paiteegvfdjqecwk',       
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
    console.log(error)
    res.render('404')
   }
}


//<<<<<<<<<<<<<<  SUBMIT BUTTON OF OTP PAGE >>>>>>>>>>
const otpSubmit = async function (req, res, next) {
  try {
    console.log("hello iam otp submit")
    const {otp}=req.body
    // const check = req.body.otp;
    // const join = check.join('')
    console.log(otp,"TYPED OTP")
    console.log(OtpCode ,"OTPCODE")
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
    console.log(error)
  }
}


//<<<<<<<<<<<<<<  RESEND OTP   >>>>>>>>>>
const resendOtp = async function (req, res, next) {
  try {
    const otp= { checkotp: 'Enter a otp' }  
    res.json({otp});
    await otpcheck();  
  } catch (error) {
    console.log(error)
  } 
}




////----------------------------------upto here  ----------------------------------------------------------



const photoUpload=async(req,res,next)=>{
  try{
    console.log("hello iam photo upload")
      const {userId}=req.body
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result," result of photo")    
      // const imgUrl=req.file.filename
      await userCollection.updateOne({_id:userId},{$set:{image:result.secure_url}}).then(()=>{
          res.json({status:true,imageurl:result.secure_url})
      })
  }catch(err){
      console.log(err);
  }
}

const userProfile=async (req,res,next)=>{
  try{
    console.log("hello iam userprofile")
      // const userId=req.params.id;
      console.log(req.body,"formadata")

      let {username,phonenumber,address,userId} = req.body.formData
     const data=await userCollection.findByIdAndUpdate({_id:userId},{$set:{address:address,username:username}})
     console.log(data)
          res.json({status:true,data})
  }catch(err){
      console.log(err);
  }
}


const AllturfView = async (req, res) => {
  try {
    console.log("hello, I am all turfs")
    const data = await turfCollection.find({ isApprove: true }) // Filter data where isApprove is true
    if (data && data.length > 0) {
      res.json({ data });
    } else {
      return res.status(404).json({ message: "No approved turfs found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


 const TurfSingleView = async (req, res) => {
  try {
      const ID = req.params.id;
      const turf = await turfCollection.findById({ _id: ID });
      res.status(200).json({ turf });
  } catch (error) {
      console.log(error);
      res.status(500)
  }
};


const reviewSubmit = async (req, res) => {
  try {
      const { id, name, review, rating } = req.body;
      console.log(req.body)
      const turf = await turfCollection.findById({ _id: id });
      const newReview = {
          name,
          review,
          rating,
      };
      turf.reviews.push(newReview);
      const ratings = turf.reviews.map((review) => review.rating);
      const averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
      turf.rating = averageRating;
      await turf.save();
      res.status(200).json(turf);
  }
  catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
}

const getReviews = async (req, res) => {
  try {
      console.log("firstfirstfirstfirst")
      const turfId = req.params.id
      console.log(turfId, '///////')
      const reviews = await turfCollection.findById({ _id: turfId })
      res.status(200).json({ reviews:reviews.reviews.reverse() })
  } catch (error) {
      console.log(error);
      res.status(500)
  }
}

 const bookingSlot = async (req, res) => {
  const ID = req.params.id
  let date = req.params.date
  const bookDate = new Date(date)
  bookDate.setHours(0);
  bookDate.setMinutes(0);
  bookDate.setSeconds(0);
  bookDate.setMilliseconds(0);
  try {
      const booking = await bookingCollection.find({ turf: ID, bookDate })
      return res.status(200).json(booking)
  } catch (error) {
      console.log(error)
      res.status(500)
  }
}




module.exports = {userSignup,userLogin,userHome,userProfile, 
  AllturfView, TurfSingleView,
  otpSubmit,resendOtp , userData,photoUpload,bookingSlot,reviewSubmit,getReviews
}


