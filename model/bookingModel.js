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
    }
  },
  {
    timestamps: true
  }
);

const BookingModel = mongoose.model('bookings', bookingSchema);

module.exports = BookingModel;
