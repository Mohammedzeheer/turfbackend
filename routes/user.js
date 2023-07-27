const express = require('express');
const userRouter = express.Router();
const userController= require('../controller/userController')
const bookingController = require('../controller/bookingController')
const auth=require('../middleware/userJWT')
const upload= require('../middleware/photo')

userRouter.get('/',userController.userHome)
userRouter.post('/signup', userController.userSignup)
userRouter.post('/otpcheck', userController.otpSubmit)
userRouter.post('/resendotp', userController.resendOtp)
userRouter.get('/userdata/:id', userController.userData)




userRouter.post('/userlogin',userController.userLogin)
userRouter.post('/userprofile',userController.userProfile)
userRouter.post('/photoupload',upload.single("image"),userController.photoUpload)

userRouter.get('/allturfs',userController.AllturfView)
userRouter.get('/viewTurf/:id',userController.TurfSingleView)

userRouter.post('/reviews',userController.reviewSubmit)
userRouter.get('/getReviews/:id',userController.getReviews)


userRouter.post('/booking', bookingController.bookTurf);
userRouter.get('/bookingSlots/:date/:id',bookingController.bookingSlot)
userRouter.get('/payment/:id', bookingController.paymentProcess);
userRouter.post("/booking-success/:id", bookingController.bookingSuccess);
userRouter.post("/booking-failed/:id", bookingController.bookingFailed);
userRouter.get("/bookings_user/:id", bookingController.BookingHistoryUser);

// paymentProcess,bookTurf,bookingSuccess,bookingSlot
// router.post('/booking',userAuthentication,bookTurf)
// router.get('/payment/:id', paymentProcess);
// router.post("/booking-success/:id", bookingSuccess);


module.exports = userRouter;
