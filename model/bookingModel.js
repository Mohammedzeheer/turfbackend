const mongoose= require('mongoose')

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "turfData",
            required: true
        },
        bookDate:
        {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },
        payment: {
            type: String,
            required: true,
            default: 'Pending'
        },
        cancelBooking:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('bookings', bookingSchema)
