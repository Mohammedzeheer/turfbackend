const express = require('express');
const userRouter = express.Router();
const userController= require('../controller/userController')
const auth=require('../middleware/jwt')
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



module.exports = userRouter;
