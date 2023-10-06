const partnerCollection = require("../model/partnerModel");
const turfCollection = require("../model/turfModel");
const bookingCollection = require("../model/bookingModel");
const cloudinary = require("../helpers/Cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("mongoose");
require("mongodb");
require("dotenv").config();

//<<<<<<<<<<<<<<<<<<<<<<  PARTNER LOGIN FUNCTION HERE >>>>>>>>>>>>>>>>>>>>>

const partnerLogin = async (req, res) => {
  try {
    const { email, password } = req.body; 

    if (!email) {
      return res.status(400).json({message:"Email is required" });
    } else if (!password) {
      return res.status(400).json({ message:"Password is required"});
    }

    const partner = await partnerCollection.findOne({ email: email });

    if (!partner) {
      return res.status(404).json({ message:"Incorrect email" });
    }

    if (partner.isApprove===false) {
      return res.status(403).json({ message:"Not approved by admin" });
    }
    if (partner.isBlock) {
      return res.status(403).json({ message:"You are Blocked" });
    }
    const auth = await bcrypt.compare(password, partner.password);

    if (auth) {
      const token = jwt.sign(
        { partnerId: partner._id },
        process.env.PARTNER_TOKEN_SECRET,
        { expiresIn: "3d" }
      );
      return res.json({ login: true, token, partner });
    } else {
      return res.status(401).json({ message:"Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const partnerLogin1 = async (req, res) => {
  try {
    const { email, password } = req.body;
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
        let auth = password
          ? await bcrypt.compare(password, partner.password)
          : null;
        if (auth) {
          const token = jwt.sign(
            { partnerId: partner._id },
            process.env.PARTNER_TOKEN_SECRET,
            { expiresIn: "3d" }
          );
          res.json({ login: true, token, partner });
        } else {
          const errors = { password: "incorrect password" };
          res.json({ errors, created: false });
        }
      }
    } else {
      const errors = { email: "incorrect email" };
      res.json({ errors, created: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//<<<<<<<<<<<<<<<<<<<<<< PARTNER REGISTRATION FUNCTION ---->>>>>>>>>>>>>>>>>>>>>
let partnerdata;
const partnerSignup = async (req, res) => {
  try {
    let { email, phonenumber, turfname, username, password } = req.body;
    const checkusername = await partnerCollection.find({ email: email });
    if (checkusername.length > 0) {
      const errors = { email: "email already exists" };
      return res.json({ errors, created: false });
    }
    partnerdata = {
      username: username,
      phonenumber: phonenumber,
      email: email,
      turfname: turfname,
      password: password,
    };

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
      const errors = { username: "Enter a valid username" };
      return res.json({ errors, created: false });
    }
    if (!passwordRegex.test(password)) {
      const errors = { password: "Enter a valid password" };
      return res.json({ errors, created: false });
    }
    if (!emailRegex.test(email)) {
      const errors = { email: "Enter a valid email" };
      return res.json({ errors, created: false });
    } else {
      const otp = { checkotp: "Enter a otp" };
      res.json({ otp, created: false });
      await sendOtpToPartner(partnerdata);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//<<<<<<<<<<<<<<  WHEN PARTNER SIGNUP OTP PAGE APPEAR AND THIS FUNCTION WORKS >>>>>>>>>>
let OtpCode;
const sendOtpToPartner = async function (req, res, next) {
  try {
    OtpCode = Math.floor(100000 + Math.random() * 988800);
    otp = OtpCode;
    otpEmail = partnerdata.email;
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NodeMailer_Mail,
        pass: process.env.NodeMailer_Password,
      },
    });
    let docs = {
      from: "AoneTurf@gmail.com",
      to: otpEmail,
      subject: "A one Turf Varification",
      html: `<p style="font-size:24px;font-weight:bold;">${OtpCode}</p><p> A one Turf verification code, Do not share with others</p>`,
    };
    mailTransporter.sendMail(docs, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//<<<<<<<<<<<<<<  SUBMIT BUTTON OF OTP PAGE >>>>>>>>>>
const otpPartnerSubmit = async function (req, res, next) {
  try {
    const { otp } = req.body;
    if (OtpCode == otp) {
      let { username, phonenumber, turfname, password, email } = partnerdata;
      password = password ? await bcrypt.hash(password, 10) : null;
      const newpartner = new partnerCollection({
        email,
        phonenumber,
        turfname,
        username,
        password,
      });
      const data = await newpartner.save();
      res.json({ user: data, created: true });
    } else {
      const errors = "Wrong Otp";
      res.json({ errors, created: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//<<<<<<<<<<<<<<<<<<<<<  RESEND OTP   >>>>>>>>>>>>>>>>>>>
const otpResendPartner = async function (req, res, next) {
  try {
    const otp = { checkotp: "Enter a otp" };
    res.json({ otp });
    await sendOtpToPartner();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< PARTNER PROFILE GET >>>>>>>>>>>>>>>>>>>>>>>>>>>
const partnerProfile = async (req, res) => {
  try {
    const partnerId = req.partnerId;
    const partnerData = await partnerCollection.findById({ _id: partnerId });
    if (!partnerData) {
      return res.status(404).json({ error: "Partner not found" });
    }
    return res.status(200).json({ data: partnerData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< PARTNER PROFILE UPDATE  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const updateProfile = async (req, res, next) => {
  try {
    const partnerId = req.partnerId;
    const { username, phonenumber, address } = req.body.formData;
    if (!username || !phonenumber || !address) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }
    const updatedData = await partnerCollection.findByIdAndUpdate(
      { _id: partnerId },
      { $set: { address, phonenumber, username } },
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ status: false, message: "Partner not found" });
    }
    res.json({ status: true, data: updatedData });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//<<<<<<<<<<<<<<<<<  PROFILE PHOTO UPLOAD BY PARTNER   >>>>>>>>>>>>>>>
const profilePhotoUpload = async (req, res, next) => {
  try {
    const partnerId = req.partnerId;
    const result = await cloudinary.uploader.upload(req.file.path);
    await partnerCollection.updateOne(
      { _id: partnerId },
      { $set: { image: result.secure_url } }
    );
    res.status(200).json({ status: true, imageurl: result.secure_url });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error uploading photo" });
  }
};

//<<<<<<<<<<<<<<<<<<<<  PARTNER TURF VIEW >>>>>>>>>>>>>>>>>>>
const ManagerTurfView = async (req, res) => {
  try {
    const partnerID = req.partnerId;
    if (partnerID) {
      const turf = await turfCollection.find({ partnerId: partnerID });
      if (turf) {
        return res.json({ data: turf });
      } else {
        return res.status(404).json({ message: "Turf not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< TURF DETAIL VIEW >>>>>>>>>>>>>>>>>>>>>>>>>>>
const TurfDetailView = async (req, res) => {
  try {
    const turfId = req.params.id;
    if (turfId) {
      const turf = await turfCollection.findById(turfId);
      if (turf) {
        return res.json({ data: turf });
      } else {
        return res.status(404).json({ message: "Turf not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< tOTAL COUNTS OF DATA TO DASHBOARD  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const totalCount = async (req, res) => {
  try {
    const partner = req.partnerId;

    const Turf = await turfCollection.find({ partnerId: partner });
    if (!Turf) return res.status(400).json({ message: "No Turfs Found " });
    const turfId = Turf._id;

    const bookingCount = await bookingCollection
      .findOne({ partner: partner, payment: "Success" })
      .count();
    const userCount = await bookingCollection.find({ turfId }).distinct("user");

    const query = { cancelBooking: false, partner: partner };
    const projection = { _id: 0, price: 1 };
    const bookings = await bookingCollection.find(query, projection);
    const TotalRevenue = bookings.reduce(
      (accumulator, item) => accumulator + item.price,0);

    const dayWiseBookings = await bookingCollection.aggregate([
      {
        $match: { payment: "Success" },
      },
      {
        $group: {
          _id: { partner: "$partner", bookDate: "$bookDate" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { bookDate: 1 },
      },
    ]);

    const filterData = dayWiseBookings
      .filter((item) => {
        return item._id.partner == partner;
      })
      .map((item) => {
        const date = new Date(item._id.bookDate);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();

        return {
          date: `${day}-${month}-${year}`,
          count: item.count,
        };
      });
    res.status(200).json({
        dayWiseBookings: filterData,
        userCount: userCount.length,
        bookingCount,
        TotalRevenue,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  partnerSignup,
  otpPartnerSubmit,
  partnerLogin,
  otpResendPartner,
  ManagerTurfView,
  partnerProfile,
  updateProfile,
  profilePhotoUpload,
  TurfDetailView,
  totalCount,
};