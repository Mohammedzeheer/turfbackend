const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtUser= (req, res, next) => {
  const jwttoken = req.headers.authorization;
  let token = jwttoken.replace(/"/g, ''); 
  if (token) {
    try {
      console.log(jwttoken, "jwt user -------------------------------");
      const user = jwt.verify(token, process.env.USER_TOKEN_SECRET);
      req.UserId=user.id
      console.log(user, "jwt user -------------------------------");
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Token missing' });
  }
};

module.exports=jwtUser;

























// const JWT = require('jsonwebtoken');
// const dotenv =require("dotenv").config()

// const auth = (req, res, next) => {
//   const { token } = req.body;

//   if (token) {
//     try {
//       const decode = JWT.verify(token, process.env.USER_TOKEN_SECRET); 
//       console.log(decode);
//       if (decode.exp > Date.now() / 1000) {
//         console.log("success");
//         next();
//       } else {
//         res.json({ status: 'failed', message: 'Token has expired.' });
//       }
//     } catch (err) {
//       res.json({ status: 'failed', message: 'Invalid token.' });
//     }
//   } else {
//     res.json({ status: 'failed', message: 'Token not provided.' });
//   }
// };

// module.exports = auth;











// const JWT = require('jsonwebtoken')

// const auth = (req, res, next) => {

//     const data = JSON.parse(req.body.token)
//     let token = data.token
//     if (token) {
//         let decode = JWT.verify(token, 'Key')
//         console.log(decode);
//         if (decode.exp > Date.now() / 1000) {
//             console.log("success");
//             next()
//         } else {
//             res.json({ status: 'failed' })
//         }
//     } else {
//         res.json({ status: 'failed' })
//     }

// }

// module.exports = auth

