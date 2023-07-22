const turfCollection = require('../model/turfModel')



const AddTurf = async (req, res) => {
    try {
      console.log("hello iam addturf");
      console.log(req.body);
  
      // Parse the JSON strings into JavaScript objects
      const venueTypes = JSON.parse(req.body.venueTypes);
      const prices = JSON.parse(req.body.prices);
  
      const {
        courtName,
        mobileNumber,
        state,
        district,
        description,
        location,
        userId,
      } = req.body;
  
      console.log('Court Name:', courtName);
      console.log('Mobile Number:', mobileNumber);
      console.log('State:', state);
      console.log('District:', district);
      console.log('Description:', description);
      console.log('Location:', location);
      console.log('Venue Types:', venueTypes);
      console.log('Prices:', prices);
      console.log('userId:', userId);
      
      // const files = req.files?.photos?.map((file) => file.filename);
      const files = req.files?.map((file) => file.filename);  
   
      await turfCollection.create({
        partnerId:userId,
        courtName,
        mobileNumber,
        state,
        district,
        description,
        location,
        venueTypes,
        prices,
        //photos: files.map((file) => file.filename),
        images:files
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