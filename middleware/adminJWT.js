const JWT = require('jsonwebtoken');
const dotenv =require("dotenv").config()

const authJWT = (req, res, next) => {
  const { token } = req.body;

  if (token) {
    try {
      const decode = JWT.verify(token, process.env.ADMIN_TOKEN_SECRET); 
      console.log(decode);
      if (decode.exp > Date.now() / 1000) {
        console.log("success");
        next();
      } else {
        res.json({ status: 'failed', message: 'Token has expired.' });
      }
    } catch (err) {
      res.json({ status: 'failed', message: 'Invalid token.' });
    }
  } else {
    res.json({ status: 'failed', message: 'Token not provided.' });
  }
};

module.exports = authJWT;