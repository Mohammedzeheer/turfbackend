const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "turfDatas",
      required: true
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partners",
      required: true
    },
    bookDate: {
      type: String,
      required: true
    },
    time: {
      type: String,
      //required: true
    },
    price: {
      type: Number,
      required: true
    },
    slot: {
      type: String,
      // required: true
    },
    payment: {
      type: String,
      required: true,
      default: 'Pending'
    },
    cancelBooking: {
      type: Boolean,
      default: false
    },
    cancelReason: {
      type: String,
    },
    paymentMethod: {
      type: String,
      //required: true
    },
  },
  {
    timestamps: true
  }
);

const BookingModel = mongoose.model('bookings', bookingSchema);

module.exports = BookingModel;
