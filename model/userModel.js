const mongoose= require('mongoose')

const userSchema = new mongoose.Schema({
      username: {type:String,require: true},
      password :{type:String,required:true},
      email:{type:String},
      phonenumber:{type:Number},
      isBlock:{type:Boolean,default:false},
      image:{type:String},
      wallet:{type:Number,default:0},
      address:{type:String},
      messages: [{ type: mongoose.Types.ObjectId, ref: 'messages' }],

})

module.exports = mongoose.model ('users', userSchema)