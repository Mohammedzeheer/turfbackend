const express = require('express');
const partnerRouter = express.Router();
const partnerController= require('../controller/partnerController')
const turfController=require('../controller/turfController')
const upload= require('../middleware/image')


partnerRouter.post('/partnersignup',partnerController.partnerSignup)
partnerRouter.post('/partnerlogin',partnerController.partnerLogin)
partnerRouter.post('/addturf',upload.array('photos',5),turfController.AddTurf)





module.exports = partnerRouter;
