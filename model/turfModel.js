const mongoose= require('mongoose')

const turfSchema = new mongoose.Schema({
      partnerId: { type: mongoose.Types.ObjectId, required: true },
      courtName:{type:String,require: true},
      mobileNumber:{type:String,require: true},
      state:{type:String,require: true},
      district:{type:String,require: true},
      description:{type:String},
      location:{type:String,require: true},
      venueTypes:{type:Array,required:true},
      prices: {type:Object,require: true},
      images:{type:Array},
      isApprove:{type:Boolean,default:false}
})

module.exports = mongoose.model ('turfData', turfSchema)