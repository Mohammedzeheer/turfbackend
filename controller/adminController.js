const adminCollection = require("../model/adminModel");
const userCollection = require("../model/userModel");
const partnerCollection = require("../model/partnerModel");
const turfCollection = require("../model/turfModel");
const bookingCollection = require("../model/bookingModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN LOGIN  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const adminLogin = async (req, res) => {
  try {
    let { username, password } = req.body;
    if(username == '' || password=='') {
      return res.status(400).json({message:'Empty Field'});
    }
    else if (username === undefined) {
        return res.status(400).json({message:'User Name required'});
    } else if (password === undefined) {
        return res.status(400).json({ message:'Password required'});
    } 
    let admin = await adminCollection.findOne({ username });
    if (admin) {
      if (admin.password === password) {
        const token = jwt.sign(
          { id: admin._id },
          process.env.ADMIN_TOKEN_SECRET,
          { expiresIn: "3d" }
        );
        res.status(200).json({token});
      } else {
        return res.status(401).json({ message:'Invalid Password'});
      }
    } else {
      return res.status(404).json({ message:"Admin Not Found"});
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN GET ALL USER LIST >>>>>>>>>>>>>>>>>>>>>>>>>>>
const userList = async (req, res) => {
  try {
    const data = await userCollection.find({});
    if (data) {
      res.json({ data });
    } else {
      return res.status(404).json({ message: "Users are not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN ACCESS ALL PARTNER DATA  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const partnerList = async (req, res) => {
  try {
     const data = await partnerCollection.find({});
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN  BLOCK USERS >>>>>>>>>>>>>>>>>>>>>>>>>>>
const blockUser = async (req, res) => {
  try {
    const {userId } = req.body;
    const userData = await userCollection.findOne({ _id: userId });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN UNBLOCK USERS  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const UnBlockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userCollection.findOne({ _id: userId });
    if (userData) {
      const data = await userCollection.updateOne(
        { _id: userData._id },
        { $set: { isBlock: false } }
      );
      if (data.modifiedCount > 0) {
        return res.json({ data, message: "User Unblocked successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN APPROVE A PARTNER  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const approvePartner = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

//<<<<<<<<<<<<<<<-----ADMIN BLOCK A PARTNER  ------->>>>>>>>>>>>>>>>>>
const blockManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

//<<<<<<<<<<<<<<<-----  ADMIN UNBLOCK A PARTNER------->>>>>>>>>>>>>>>>>>
const UnBlockManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await partnerCollection.findOne({ _id: userId });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN ACCESS ALL TURF DATA  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const TurfList = async (req, res) => {
  const data = await turfCollection.find({});
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN APPROVE TURFS >>>>>>>>>>>>>>>>>>>>>>>>>>>
const approveTurfs = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await turfCollection.findOne({ _id: userId });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN GET ALL BOOKING DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>
const bookingLists = async (req, res) => {
  const response = await bookingCollection
    .find({})
    .populate("turf")
    .populate("user")
    .sort({ createdAt: -1 });
  res.status(200).json({ response });
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN GET SALES REPORT  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const salesReport = async (req, res) => {
  const response = await bookingCollection
    .find({})
    .populate("turf")
    .populate("user")
  res.status(200).json({ response });
};

///<<<<<<<<<<<<<<<<<<<<<<<< ADMIN GET DASHBOARD DATA  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const TotalCounts = async (req, res) => {
  try {
    const UserCounts = await userCollection.find().count();
    const PartnerCounts = await partnerCollection.find().count();
    const BookingCount = await bookingCollection.find().count();
    const query = { cancelBooking: false };
    const projection = { _id: 0, price: 1, createdAt: 1 };
    const bookings = await bookingCollection.find(query, projection);
    const TotalRevenue = bookings.reduce(
      (accumulator, item) => accumulator + item.price,
      0
    );
    // Group bookings by month
    const monthlyRevenue = bookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.bookDate);
      const yearMonth =
        bookingDate.getFullYear() + "-" + (bookingDate.getMonth() + 1);
      if (!acc[yearMonth]) {
        acc[yearMonth] = 0;
      }
      acc[yearMonth] += booking.price;
      return acc;
    }, {});
    // Group bookings by day
    const dailyRevenue = bookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.createdAt);
      const yearMonthDay = bookingDate.toISOString().slice(0, 10);
      if (!acc[yearMonthDay]) {
        acc[yearMonthDay] = 0;
      }
      acc[yearMonthDay] += booking.price;
      return acc;
    }, {});
    res.status(200).json({
      UserCounts: UserCounts,
      PartnerCounts: PartnerCounts,
      BookingCount: BookingCount,
      TotalRevenue: TotalRevenue,
      dailyRevenue: dailyRevenue,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
  bookingLists,
  TotalCounts,
  salesReport
};
