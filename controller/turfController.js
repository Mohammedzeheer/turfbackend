const turfCollection = require('../model/turfModel')
const cloudinary = require('../helpers/Cloudinary')
require('nodemailer')
require('dotenv').config()

///<<<<<<<<<<<<<<<<<<<<<<<< ADDING TURF BY PARTNER  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const AddTurf = async (req, res) => {
  try {
    const venueTypes = JSON.parse(req.body.venueTypes);
    const prices = JSON.parse(req.body.prices);
    const partnerId= req.partnerId
    const {
      courtName,
      mobileNumber,
      state,
      district,
      description,
      location,
      openingTime,
      closingTime,
    } = req.body;

    const files = req.files?.map((file) => file.path);
    const cloudinaryUploadPromises = files.map((filePath) =>
      cloudinary.uploader.upload(filePath)
    );

    const cloudinaryResults = await Promise.all(cloudinaryUploadPromises);
    const images = cloudinaryResults.map((result) => result.secure_url);

    await turfCollection.create({
      partnerId,
      courtName,
      mobileNumber,
      state,
      district,
      description,
      location,
      venueTypes,
      prices,
      images,
      openingTime,
      closingTime,
    });
    res.json({ message: 'Turf added successfully!' });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports={AddTurf}