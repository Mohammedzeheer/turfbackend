const express = require('express');
const partnerRouter = express.Router();
const partnerController= require('../controller/partnerController')
const turfController=require('../controller/turfController')
const upload= require('../middleware/image')


partnerRouter.post('/partnersignup',partnerController.partnerSignup)
partnerRouter.post('/partnerlogin',partnerController.partnerLogin)
partnerRouter.post('/otppartnersubmit', partnerController.otpPartnerSubmit)
partnerRouter.post('/resendpartnerotp', partnerController.otpResendPartner)

partnerRouter.post('/addturf',upload.array('photos',5),turfController.AddTurf)

partnerRouter.get('/partnerturfview/:id',partnerController.ManagerTurfView)
partnerRouter.get('/profile/:id',partnerController.ManagerTurfView)




module.exports = partnerRouter;
