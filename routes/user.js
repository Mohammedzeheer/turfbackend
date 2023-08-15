const express = require('express');
const userRouter = express.Router();
const userController= require('../controller/userController')
const bookingController = require('../controller/bookingController')
const jwtUser=require('../middleware/userJWT')
const upload= require('../middleware/image')
const checkUserBlock= require('../middleware/userBlock')

//GET
userRouter.get('/userdata',jwtUser, userController.userData)
userRouter.get('/allturfs',userController.AllturfView)
userRouter.get('/viewTurf/:id',userController.TurfSingleView)
userRouter.get('/getReviews/:id',userController.getReviews)
userRouter.get('/bookingSlots/:date/:id',jwtUser,bookingController.bookingSlot)
userRouter.get('/payment/:id', bookingController.paymentProcess);
userRouter.get('/bookings_user',jwtUser, bookingController.BookingHistoryUser);
userRouter.get('/getMessages',jwtUser,userController.getMessages)
//POST
userRouter.post('/signup', userController.userSignup)
userRouter.post('/otpcheck', userController.otpSubmit)
userRouter.post('/resendotp', userController.resendOtp)
userRouter.post('/userlogin',userController.userLogin)
userRouter.post('/userprofile',jwtUser,userController.userProfile)
userRouter.post('/photoupload',upload.single("image"),jwtUser,userController.photoUpload)
userRouter.post('/reviews',jwtUser,userController.reviewSubmit)
userRouter.post('/booking',checkUserBlock,jwtUser, bookingController.bookTurf);
userRouter.post("/booking-success/:id", bookingController.bookingSuccess);
userRouter.post("/booking-failed/:id", bookingController.bookingFailed);
userRouter.post("/cancelbooking/:id",jwtUser, bookingController.CancelBooking);
userRouter.post('/addMessages',jwtUser,userController.AddMessages)

module.exports = userRouter;
