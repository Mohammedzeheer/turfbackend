const express = require('express');
const userRouter = express.Router();
const userController= require('../controller/userController')
const auth=require('../middleware/jwt')
const upload= require('../middleware/photo')

userRouter.get('/',userController.userHome)
userRouter.post('/signup', userController.userSignup)
userRouter.post('/userlogin',userController.userLogin)
userRouter.post('/userprofile',upload.single("image"),userController.userProfile)
userRouter.get('/allturfs',userController.AllturfView)
userRouter.get('/viewTurf/:id',userController.TurfSingleView)

module.exports = userRouter;
