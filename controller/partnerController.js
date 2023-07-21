const partnerCollection = require('../model/partnerModel')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')




//<<<<<<<<<<<<<<<<<<<<<<----Partner lOGIN FUNCTION here ---->>>>>>>>>>>>>>>>>>>>>
const partnerLogin = async (req, res) => {
  try {
    console.log("hello iam userlogin");
    const { email, password } = req.body;
    console.log(email, "hello iam userlogin");
    const partner = await partnerCollection.findOne({ email: email });

    if (email === undefined) {
      const errors = { email: "email required" };
      res.json({ errors, created: false });
    } else if (password === undefined) {
      const errors = { password: "Password required" };
      res.json({ errors, created: false });
    } else if (partner) {
      if (partner.isApprove === false) {
        const errors = { approval: "not approved by admin" };
        res.json({ errors, created: false });
      } else {
        let auth = password ? await bcrypt.compare(password, partner.password) : null;
        console.log(auth);
        if (auth) {
          const token = jwt.sign({ sub: partner._id }, "Key", { expiresIn: "3d" }); // adding token here
          console.log(token);
          res.json({ login: true, token, partner });
        } else {
          const errors = { password: "incorrect password" };
          res.json({ errors, created: false });
        }
      }
    } else {
      console.log("error");
      const errors = { email: "incorrect email" };
      res.json({ errors, created: false });
    }
  } catch (error) {
    console.log(error);
  }
};



//<<<<<<<<<<<<<<<<<<<<<<----Partner Registration done here ---->>>>>>>>>>>>>>>>>>>>>
const partnerSignup = async (req, res) => {
  try {
    console.log("iam in partnersignup dkgsadsadsadsasdhs")
    let { email, phonenumber, turfname, username, password } = req.body;
    console.log("iam in partnersignup dkgsadsadsadsasdhs", username)
    const checkusername = await partnerCollection.find({ username: username });

    if (checkusername.length > 0) {
      const errors = { username: 'Username already exists' };
      return res.json({ errors, created: false });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
      const errors = { username: 'Enter a valid username' };
      return res.json({ errors, created: false });
    }

    if (!passwordRegex.test(password)) {
      const errors = { password: 'Enter a valid password' };
      return res.json({ errors, created: false });
    }

    if (!emailRegex.test(email)) {
      const errors = { email: 'Enter a valid email' };
      return res.json({ errors, created: false });
    }


    else {
      console.log("hello iam partner else")
      password = password ? await bcrypt.hash(password, 10) : null;

      const newpartner = new partnerCollection({
        email, phonenumber, turfname, username, password
      })
      await newpartner.save();

      res.json({ user: data, created: true });
    }
  } catch (error) {
    res.json({ error, created: false });
  }
};

module.exports = { partnerSignup, partnerLogin }