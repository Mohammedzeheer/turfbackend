const express = require('express');
const AdminRouter = express.Router();
const adminController= require('../controller/adminController')
const chatContoller=require('../controller/chatController')
const adminJWT= require('../middleware/adminJWT')

//GET
AdminRouter.get('/users',adminJWT,adminController.userList)
AdminRouter.get('/turfs',adminJWT,adminController.TurfList)
AdminRouter.get('/partners',adminJWT,adminController.partnerList)
AdminRouter.get('/bookingList',adminJWT,adminController.bookingLists)
AdminRouter.get('/allCounts',adminJWT,adminController.TotalCounts)
AdminRouter.get('/salesReport',adminJWT,adminController.salesReport)
AdminRouter.get('/getMessages',chatContoller.getMessages)
//POST
AdminRouter.post('/adminLogin',adminController.adminLogin)
AdminRouter.post('/blockuser',adminJWT,adminController.blockUser)
AdminRouter.post('/unblockuser',adminJWT,adminController.UnBlockUser)
AdminRouter.post('/approveTurfs',adminJWT,adminController.approveTurfs)
AdminRouter.post('/approvePartner',adminJWT,adminController.approvePartner)
AdminRouter.post('/blockpartner',adminJWT,adminController.blockManager)
AdminRouter.post('/unblockpartner',adminJWT,adminController.UnBlockManager)
AdminRouter.post('/addMessages',chatContoller.AddMessages)

module.exports = AdminRouter;
