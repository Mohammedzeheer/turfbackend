const adminCollection = require("../model/adminModel");
const userCollection = require("../model/userModel");
const partnerCollection = require("../model/partnerModel");
const turfCollection = require("../model/turfModel");
const bookingCollection = require("../model/bookingModel");
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
        const token = jwt.sign(
          { sub: admin._id },
          process.env.ADMIN_TOKEN_SECRET,
          { expiresIn: "3d" }
        );
        res.json({ admin: true, token });
      } else {
        const errors = { username: "Invalid password" };
        res.json({ errors, admin: false });
      }
    } else {
      const errors = { username: "Username not found" };
      res.json({ errors, admin: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const userList = async (req, res) => {
  const data = await userCollection.find({});
  if (data) {
    res.json({ data });
  } else {
    return res.status(404).json({ message: "Users are  not found" });
  }
};

const partnerList = async (req, res) => {
  console.log("hello iam user data .......-------");
  const data = await partnerCollection.find({});
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

const bookingLists = async (req, res) => {
  const response = await bookingCollection
    .find({})
    .populate("turf")
    .populate("user")
    .sort({ createdAt: -1 });
  res.status(200).json({ response });
};


const salesReport = async (req, res) => {
  const response = await bookingCollection
    .find({})
    .populate("turf")
    .populate("user")
  res.status(200).json({ response });
};





const TotalCounts = async (req, res) => {
  try {
    const UserCounts = await userCollection.find().count();
    const PartnerCounts = await partnerCollection.find().count();
    const BookingCount = await bookingCollection.find().count();

    // const query = { cancelBooking: false };
    // const projection = { _id: 0, price: 1 };
    // const totalRevenue = await bookingCollection.find(query, projection)
    // console.log(totalRevenue,'--------------------------------------');
    // const TotalPrice = totalRevenue.reduce((accumulator, item) => accumulator + item.price, 0);

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
    console.log(
      monthlyRevenue,
      "----------------------------------------------"
    );

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
    console.log(dailyRevenue, "dailyRevenue------------------------------");

    res.status(200).json({
      UserCounts: UserCounts,
      PartnerCounts: PartnerCounts,
      BookingCount: BookingCount,
      TotalRevenue: TotalRevenue,
      dailyRevenue: dailyRevenue,
    });
  } catch (error) {
    console.log(error);
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
