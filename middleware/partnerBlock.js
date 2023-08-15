const partnerCollection=require('../model/partnerModel')

const checkPartnerBlock = async (req, res, next) => {
   try {
     const { email } = req.body;
     const partnerData = await partnerCollection.findOne({ email: email });
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
     return res.status(500).json({ message: "Internal server error" });
   }
 };

 
module.exports= checkPartnerBlock;