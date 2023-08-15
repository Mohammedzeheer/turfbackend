const userCollection = require("../model/userModel");
const turfCollection = require("../model/turfModel");
const bookingCollection = require("../model/bookingModel");
const paymentStripe = require('../helpers/Stripe')
const sendMail = require('../helpers/email')

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING SLOT GET  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const bookingSlot = async (req, res) => {
  const ID = req.params.id;
  let date = req.params.date;
  const bookDate = new Date(date);
  bookDate.setHours(0);
  bookDate.setMinutes(0);
  bookDate.setSeconds(0);
  bookDate.setMilliseconds(0);
  try {
    const booking = await bookingCollection.find({ turf: ID, bookDate });
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOK TURF POST METHOD  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const bookTurf = async (req, res) => {
  try {
    let userId = req.UserId;
    const { ID, date, time, price, slot, selectedPaymentMethod } = req.body;
    const turf = await turfCollection.findById({ _id: ID });
    const partnerId = turf.partnerId;
    const bookDate = new Date(date);
    bookDate.setHours(0);
    bookDate.setMinutes(0);
    bookDate.setSeconds(0);
    bookDate.setMilliseconds(0);

    if (selectedPaymentMethod == "wallet") {
      const result = await userCollection.findById(userId);
      const walletPrice = result.wallet;
      if (walletPrice < price) {
        const errors = { wallet: "Insufficient Balance" };
        return res.json({ errors, created: false });
      } else {
        const newBooking = await bookingCollection.create({
          user: userId,
          turf: ID,
          partner: partnerId,
          bookDate,
          time,
          price,
          slot,
          paymentMethod: selectedPaymentMethod,
        });
        const newwalletprice = walletPrice - price;
        await userCollection.updateOne(
          { _id: userId },
          { $set: { wallet: newwalletprice } }
        );
        res.status(200).json(newBooking);
      }
    } else {
      const newBooking = await bookingCollection.create({
        user: userId,
        turf: ID,
        partner: partnerId,
        bookDate,
        time,
        price,
        slot,
        paymentMethod: selectedPaymentMethod,
      });
      res.status(200).json(newBooking);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING PAYMENT PROCESS >>>>>>>>>>>>>>>>>>>>>>>>>>>
const paymentProcess = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingCollection
      .findById(bookingId)
      .populate("user")
      .populate("turf");
    const response = await paymentStripe(
      result.price,
      result.turf.courtName,
      result.user.email,
      bookingId
    );
    res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING SUCCESS >>>>>>>>>>>>>>>>>>>>>>>>>>>
const bookingSuccess = async (req, res) => {
  const ID = req.params.id;
  try {
    const result = await bookingCollection
      .findById(ID)
      .populate("user")
      .populate("turf");
    if (result) {
      await bookingCollection.findByIdAndUpdate(ID, { payment: "Success" });
      await sendMail(result)
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error?.response?.data);
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING FAILED  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const bookingFailed = async (req, res) => {
  const Id = req.params.id;
  try {
    const result = await bookingCollection
      .findById(Id)
      .populate("user")
      .populate("turf");
    if (result) {
      await bookingCollection.findByIdAndUpdate(Id, { payment: "failed" });
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error?.response?.data);
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING HISTORY TO SHOW USER >>>>>>>>>>>>>>>>>>>>>>>>>>>
const BookingHistoryUser = async (req, res) => {
  const userId = req.UserId;
  try {
    const data = await bookingCollection
      .find({ user: userId })
      .populate("user")
      .populate("turf")
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< BOOKING HISTORY TO PARTNER GET  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const BookingsHistoryPartner = async (req, res) => {
  const partnerId = req.partnerId;
  try {
    const data = await bookingCollection
      .find({ partner: partnerId })
      .populate("user")
      .populate("turf")
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<< CANCEL BOOKING  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const CancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.UserId;
    const { reason } = req.body;
    const data = await bookingCollection.updateOne(
      { _id: bookingId },
      { $set: { cancelBooking: true, cancelReason: reason } }
    );
    const Bookingdata = await bookingCollection.find({ _id: bookingId });
    if (
      Bookingdata[0].payment == "Success" &&
      Bookingdata[0].cancelBooking == true
    ) {
      const userdata = await userCollection.find({ _id: userId });
      let walletprice = userdata[0].wallet;
      let newWalletPrice = walletprice + Bookingdata[0].price;
      await userCollection.updateOne(
        { _id: userId },
        { $set: { wallet: newWalletPrice } }
      );
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  paymentProcess,
  bookTurf,
  bookingSuccess,
  bookingSlot,
  bookingFailed,
  BookingHistoryUser,
  BookingsHistoryPartner,
  CancelBooking,
};
