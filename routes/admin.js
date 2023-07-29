const express = require('express');
const AdminRouter = express.Router();
const adminController= require('../controller/adminController')
const auth= require('../middleware/userJWT')

AdminRouter.post('/adminLogin',adminController.adminLogin)

AdminRouter.get('/users',adminController.userList)
AdminRouter.post('/blockuser',adminController.blockUser)
AdminRouter.post('/unblockuser',adminController.UnBlockUser)

AdminRouter.get('/partners',adminController.partnerList)
AdminRouter.post('/approvePartner',adminController.approvePartner)
AdminRouter.post('/blockpartner',adminController.blockManager)
AdminRouter.post('/unblockpartner',adminController.UnBlockManager)


AdminRouter.get('/turfs',adminController.TurfList)
AdminRouter.post('/approveTurfs',adminController.approveTurfs)

AdminRouter.get('/bookingList',adminController.bookingLists)




module.exports = AdminRouter;
