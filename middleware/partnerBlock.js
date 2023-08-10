const partnerCollection=require('../model/partnerModel')

const checkPartnerBlock = async (req, res, next) => {
   try {
       console.log('hello iam is user block checking middleware-----------------------',req.body)
     const { email } = req.body;
     const partnerData = await partnerCollection.findOne({ email: email });
     console.log(partnerData);

     if (!partnerData) {
       return res.status(403).json({ message: "User Not Found" });
     }

     if (partnerData.isBlock) {
       return res.status(403).json({ message: "User is blocked" });
     }
     else{
        next(); 
     } 
   } catch (error) {
     console.log(error);
     return res.status(500).json({ message: "Internal server error" });
   }
 };

 
module.exports= checkPartnerBlock;