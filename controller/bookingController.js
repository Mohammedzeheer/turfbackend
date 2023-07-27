const userCollection = require('../model/userModel')
const turfCollection= require('../model/turfModel')
const bookingCollection = require('../model/bookingModel')
const jwt = require('jsonwebtoken');
const  paymentStripe  = require('../Helpers/Stripe.js') 


const bookingSlot = async (req, res) => {
    const ID = req.params.id
    let date = req.params.date
    const bookDate = new Date(date)
    bookDate.setHours(0);
    bookDate.setMinutes(0);
    bookDate.setSeconds(0);
    bookDate.setMilliseconds(0);
    try {
        const booking = await bookingCollection.find({ turf: ID,bookDate })
        return res.status(200).json(booking)
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

 const bookTurf = async (req, res) => {
    try {
        let token = req.headers.authorization
        
        console.log(token,'hello iam booking turf--------------------------------')
        //   let key = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // console.log(req.body ,token,'hello iam booking turf------------------------------------2')
        // console.log(key)
        const { ID, date, time, userId,price } = req.body;
        console.log(price, '----------------------------------------price')
        const turf = await turfCollection.findById({ _id: ID });
        // const price = turf.prices;
        // const userId = key.userId;
        const bookDate = new Date(date);
        bookDate.setHours(0);
        bookDate.setMinutes(0);
        bookDate.setSeconds(0);
        bookDate.setMilliseconds(0);
        const newBooking = await bookingCollection.create({
            user: userId,
            turf: ID,
            bookDate,
            time,
            price,
        });
        res.status(200).json(newBooking);
    } catch (error) {
        console.log(error);
        res.status(500)
    }
}

// let paymentStripe
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
        console.log(error);
        // res.status(500).json(error.response.data.message);
    }
};

 const bookingSuccess = async (req, res) => {
    const ID = req.params.id;
    try {
        const result = await bookingCollection
            .findById(ID)
            .populate("user")
            .populate("turf");
            console.log('hello iam booking sucess ', result);
        if (result) {
            await bookingCollection.findByIdAndUpdate(ID, { payment: "Success" });
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error.response.data);
    }
};


const bookingFailed = async (req,res)=>{
    const Id =req.params.id
try{
    const result = await bookingCollection.findById(Id).populate("user").populate("turf");
    console.log('hello iam booking failed ', result);
if (result) {
    await bookingCollection.findByIdAndUpdate(Id, { payment: "failed" });
    res.status(200).json(result);
}
}catch(error){
    console.log(error)
}
} 



const BookingHistoryUser = async (req,res)=>{
    console.log('--------hello iam booking history')
    const userId = req.params.id
    try {
       const data= await bookingCollection.find({user:userId}).populate('user').populate('turf')
       console.log(data, 'booking history')
       res.status(200).json(data);     
    } catch (error) {
        console.log(error)
    }
}


module.exports ={
    paymentProcess,bookTurf,bookingSuccess,bookingSlot,bookingFailed,
    BookingHistoryUser
}