const express = require('express');
const partnerRouter = express.Router();
const partnerController= require('../controller/partnerController')
const turfController=require('../controller/turfController')
const upload= require('../middleware/image')


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





module.exports = partnerRouter;
