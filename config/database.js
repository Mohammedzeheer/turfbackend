const mongoose= require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB, {useNewUrlParser: true})
.then(() => {
  console.log("Database Connected");
}).catch((error) => {
  console.log("datatbase error",error.message)
})


module.exports = {mongoose}