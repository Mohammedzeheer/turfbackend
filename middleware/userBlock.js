 const userCollection=require('../model/userModel')

 const checkUserBlock = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }     
      const userData = await userCollection.findOne({ email: email });
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }  
      if (userData.isBlock) {
        return res.status(403).json({ message: "User is blocked" });
      }
      next(); 
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports= checkUserBlock;






  