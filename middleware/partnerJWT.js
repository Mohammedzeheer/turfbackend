// middleware/partnerJWT.js
// import { verify } from 'jsonwebtoken'; 
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtPartner = (req, res, next) => {
  const jwttoken = req.headers.authorization;
  let token = jwttoken.replace(/"/g, ''); 
  if (token) {
    try {
      const Turf = jwt.verify(token, process.env.PARTNER_TOKEN_SECRET);
      req.partnerId=Turf.partnerId
      console.log(Turf, "jwt turf -------------------------------");
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Token missing' });
  }
};

module.exports=jwtPartner;
