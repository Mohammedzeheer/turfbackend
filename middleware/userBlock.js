 const userCollection=require('../model/userModel')


 const checkUserBlock = async (req, res, next) => {
    try {
        console.log('hello iam is user block checking middleware-----------------------',req.body)
      const { email } = req.body;
      const userData = await userCollection.findOne({ email: email });
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (userData.isBlock) {
        return res.status(403).json({ message: "User is blocked" });
      }
      next(); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  // const checkUserBlock1 = async (req, res, next) => {
  //   try {
  
  //     const { userId } = req.body;
  //     const user = await userCollection.findById(userId);
  //     if (user && user.isBlock) {
  //       return res.status(403).json({ message: 'User is blocked.' });
  //     }
  //     next();
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Internal server error.' });
  //   }
  // };


  
module.exports= checkUserBlock;






  