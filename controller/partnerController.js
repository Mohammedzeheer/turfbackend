const partnerCollection = require('../model/partnerModel')
const turfCollection = require('../model/turfModel')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')



//<<<<<<<<<<<<<<<<<<<<<<----Partner lOGIN FUNCTION here ---->>>>>>>>>>>>>>>>>>>>>
const partnerLogin = async (req, res) => {
  try {
    console.log("hello iam userlogin");
    const { email, password } = req.body;
    console.log(email, "hello iam userlogin");
    const partner = await partnerCollection.findOne({ email: email });

    if (email === undefined) {
      const errors = { email: "email required" };
      res.json({ errors, created: false });
    } else if (password === undefined) {
      const errors = { password: "Password required" };
      res.json({ errors, created: false });
    } else if (partner) {
      if (partner.isApprove === false) {
        const errors = { approval: "not approved by admin" };
        res.json({ errors, created: false });
      } else {
        let auth = password ? await bcrypt.compare(password, partner.password) : null;
        console.log(auth);
        if (auth) {
          const token = jwt.sign({ sub: partner._id }, "Key", { expiresIn: "3d" }); // adding token here
          console.log(token);
          res.json({ login: true, token, partner });
        } else {
          const errors = { password: "incorrect password" };
          res.json({ errors, created: false });
        }
      }
    } else {
      console.log("error");
      const errors = { email: "incorrect email" };
      res.json({ errors, created: false });
    }
  } catch (error) {
    console.log(error);
  }
};



//<<<<<<<<<<<<<<<<<<<<<<----Partner Registration done here ---->>>>>>>>>>>>>>>>>>>>>
let partnerdata 
const partnerSignup = async (req, res) => {
  try {
    console.log("iam in partnersignup dkgsadsadsadsasdhs")
    let { email, phonenumber, turfname, username, password } = req.body;
    const checkusername = await partnerCollection.find({ email: email });

    partnerdata = {
      username: username,
      phonenumber: phonenumber,
      email: email,
      turfname:turfname,
      password: password
    }

    if (checkusername.length > 0) {
      const errors = { email: 'email already exists' };
      return res.json({ errors, created: false });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    else {
      const otp= { checkotp: 'Enter a otp' }   
      res.json({ otp, created: false });
      await sendOtpToPartner(partnerdata);
    }
  } catch (error) {
    res.json({ error, created: false });
  }
};



//<<<<<<<<<<<<<<  WHEN USER SIGNUP OTP PAGE APPEAR AND THIS FUNCTION WORKS >>>>>>>>>>
let OtpCode;
const sendOtpToPartner = async function (req, res, next) {
   try {
    console.log(partnerdata);
    OtpCode = Math.floor(100000 + Math.random() * 988800)
    otp = OtpCode
    otpEmail = partnerdata.email
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
const otpPartnerSubmit = async function (req, res, next) {
  try {
    console.log("hello iam otp submit")
    const {otp}=req.body
    console.log(otp,"TYPED OTP")
    console.log(OtpCode ,"OTPCODE")
    if (OtpCode == otp)
    {
      let {username, phonenumber,turfname, password, email  }= partnerdata
      password = password ? await bcrypt.hash(password, 10) : null;
      const newpartner = new partnerCollection({
        email, phonenumber, turfname, username, password
      })
      const data=await newpartner.save();
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
const otpResendPartner = async function (req, res, next) {
  try {
    const otp= { checkotp: 'Enter a otp' }  
    res.json({otp});
    await sendOtpToPartner();  
  } catch (error) {
    console.log(error)
  } 
}


const partnerProfile = async (req,res)=>{
  const ID = req.params.id;
  console.log(ID)
  const data = await partnerCollection.findById({_id:ID})
  console.log(data , "iam partner datas")
  return res.json({data});
}



//<<<<<<<<<<<<<<  MANAGER TURF VIEW >>>>>>>>>>
const ManagerTurfView = async (req, res) => {
  try {
    console.log("hello iam all turfs");
    const partnerID = req.params.id;
    console.log(partnerID)
    if (partnerID) {
      const turf = await turfCollection.find({ partnerId: partnerID });
      if (turf) {
        return res.json({ data: turf });
      } else {
        return res.status(404).json({ message: "Turf not found" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { partnerSignup,otpPartnerSubmit, partnerLogin,otpResendPartner,
  ManagerTurfView,partnerProfile, }