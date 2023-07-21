const mongoose= require('mongoose')

const userSchema = new mongoose.Schema({
      username: {type:String,require: true},
      password :{type:String,required:true},
      email:{type:String},
      phonenumber:{type:Number},
      isBlock:{type:Boolean,default:false}
})

module.exports = mongoose.model ('users', userSchema)