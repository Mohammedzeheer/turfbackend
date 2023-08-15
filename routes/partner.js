const express = require('express');
const partnerRouter = express.Router();
const partnerController= require('../controller/partnerController')
const turfController=require('../controller/turfController')
const bookingController = require('../controller/bookingController')
const upload= require('../middleware/image')
const jwtPartner= require('../middleware/partnerJWT')
const checkPartnerBlock=require('../middleware/partnerBlock')

//GET
partnerRouter.get('/partnerprofile',jwtPartner, partnerController.partnerProfile)
partnerRouter.get('/partnerturfview',jwtPartner,partnerController.ManagerTurfView)
partnerRouter.get('/turfDetailview/:id',partnerController.TurfDetailView)
partnerRouter.get('/profile/:id',partnerController.ManagerTurfView)
partnerRouter.get('/bookingsData',jwtPartner,bookingController.BookingsHistoryPartner)
partnerRouter.get('/getCounts', jwtPartner, partnerController.totalCount);
//POST
partnerRouter.post('/partnersignup',partnerController.partnerSignup)
partnerRouter.post('/partnerlogin',checkPartnerBlock,partnerController.partnerLogin)
partnerRouter.post('/otppartnersubmit', partnerController.otpPartnerSubmit)
partnerRouter.post('/resendpartnerotp', partnerController.otpResendPartner)
partnerRouter.post('/updateprofile',jwtPartner, partnerController.updateProfile)
partnerRouter.post('/photoupload',upload.single("image"),jwtPartner,partnerController.profilePhotoUpload)
partnerRouter.post('/addturf',upload.array('photos',10),jwtPartner,turfController.AddTurf)


module.exports = partnerRouter;
