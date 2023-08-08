const express = require('express');
const AdminRouter = express.Router();
const adminController= require('../controller/adminController')
const chatContoller=require('../controller/chatController')

const adminJWT= require('../middleware/adminJWT')



AdminRouter.post('/adminLogin',adminController.adminLogin)

AdminRouter.get('/users',adminJWT,adminController.userList)
AdminRouter.post('/blockuser',adminJWT,adminController.blockUser)
AdminRouter.post('/unblockuser',adminJWT,adminController.UnBlockUser)

AdminRouter.get('/partners',adminJWT,adminController.partnerList)
AdminRouter.post('/approvePartner',adminJWT,adminController.approvePartner)
AdminRouter.post('/blockpartner',adminJWT,adminController.blockManager)
AdminRouter.post('/unblockpartner',adminJWT,adminController.UnBlockManager)


AdminRouter.get('/turfs',adminJWT,adminController.TurfList)
AdminRouter.post('/approveTurfs',adminJWT,adminController.approveTurfs)

AdminRouter.get('/bookingList',adminJWT,adminController.bookingLists)
AdminRouter.get('/allCounts',adminJWT,adminController.TotalCounts)

AdminRouter.get('/salesReport',adminJWT,adminController.salesReport)

AdminRouter.get('/getMessages',chatContoller.getMessages)
AdminRouter.post('/addMessages',chatContoller.AddMessages)

module.exports = AdminRouter;
