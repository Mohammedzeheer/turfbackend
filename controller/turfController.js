const turfCollection = require('../model/turfModel')
const nodemailer = require('nodemailer')
const cloudinary = require('../helpers/Cloudinary')
const dotenv =require('dotenv').config()


// const AddTurf = async (req, res) => {
//     try {
//       console.log("hello iam addturf");
//       console.log(req.body);
  
//       // Parse the JSON strings into JavaScript objects
//       const venueTypes = JSON.parse(req.body.venueTypes);
//       const prices = JSON.parse(req.body.prices);
//       // const venueTypes = req.body.venueTypes;
//       // const prices = req.body.prices;
  
//       const {
//         courtName,
//         mobileNumber,
//         state,
//         district,
//         description,
//         location,
//         userId,
//         openingTime,
//         closingTime,
//       } = req.body;

//       // const files = req.files?.photos?.map((file) => file.filename);
//       const files = req.files?.map((file) => file.filename);  
//       const result = await cloudinary.uploader.upload(req.file.path);
//       await turfCollection.create({
//         partnerId:userId,
//         courtName,
//         mobileNumber,
//         state,
//         district,
//         description,
//         location,
//         venueTypes,
//         prices,
//         //photos: files.map((file) => file.filename),
//         images:files,
//         openingTime,
//         closingTime
//       });
  
//       // Send a JSON response or redirect as needed
//       res.json({ message: 'Turf added successfully!' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Something went wrong!' });
//     }
//   };


const AddTurf = async (req, res) => {
  try {
    console.log("hello iam addturf");
    console.log(req.body);

    // Parse the JSON strings into JavaScript objects
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

    // Upload multiple photos to Cloudinary asynchronously
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

    // Send a JSON response or redirect as needed
    res.json({ message: 'Turf added successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};


const imageUpload= (req,res,next)=>{
    try{
        const {userId}=req.body
        const imgUrl=req.file.filename
        turfCollection.updateOne({_id:userId},{$set:{image:imgUrl}}).then(()=>{
            res.json({status:true,imageurl:imgUrl})
        })
    }catch(err){
        console.log(err);
    }
}






module.exports={AddTurf , imageUpload}