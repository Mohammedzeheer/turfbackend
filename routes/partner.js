const express = require('express');
const partnerRouter = express.Router();
const partnerController= require('../controller/partnerController')
const turfController=require('../controller/turfController')
const bookingController = require('../controller/bookingController')
const upload= require('../middleware/image')
const jwtPartner= require('../middleware/partnerJWT')
// import jwtPartner from '../middleware/partnerJWT';

partnerRouter.post('/partnersignup',partnerController.partnerSignup)
partnerRouter.post('/partnerlogin',partnerController.partnerLogin)
partnerRouter.post('/otppartnersubmit', partnerController.otpPartnerSubmit)
partnerRouter.post('/resendpartnerotp', partnerController.otpResendPartner)
partnerRouter.get('/partnerprofile/:id', partnerController.partnerProfile)
partnerRouter.post('/updateprofile', partnerController.updateProfile)
partnerRouter.post('/photoupload',upload.single("image"),partnerController.profilePhotoUpload)

partnerRouter.post('/addturf',upload.array('photos',10),turfController.AddTurf)
partnerRouter.get('/partnerturfview/:id',partnerController.ManagerTurfView)
partnerRouter.get('/turfDetailview/:id',partnerController.TurfDetailView)
partnerRouter.get('/profile/:id',partnerController.ManagerTurfView)

partnerRouter.get('/bookingsData/:id',bookingController.BookingsHistoryPartner)

// partnerRouter.get('/getCounts',jwtPartner,partnerController.totalCount)
partnerRouter.get('/getCounts', jwtPartner, partnerController.totalCount);




module.exports = partnerRouter;
