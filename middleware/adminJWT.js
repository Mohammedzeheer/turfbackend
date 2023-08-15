const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtAdmin= (req, res, next) => {
  const jwttoken = req.headers.authorization;
  let token = jwttoken.replace(/"/g, ''); 
  if (token) {
    try {
      const admin = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      req.adminId=admin.id 
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Token missing' });
  }
};

module.exports=jwtAdmin;