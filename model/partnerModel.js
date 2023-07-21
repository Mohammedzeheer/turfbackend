const mongoose= require('mongoose')

const partnerSchema = new mongoose.Schema({
      email:{type:String,require: true},
      phonenumber:{type:Number,require: true},
      turfname:{type:String,required:true},
      username: {type:String,require: true},
      password :{type:String,required:true},
      isApprove:{type:Boolean,default:false},
      isBlock:{type:Boolean,default:false},
})

module.exports = mongoose.model ('partners', partnerSchema)