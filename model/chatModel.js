// const mongoose= require('mongoose')

// const chatSchema = new mongoose.Schema({
//       userId: { type: mongoose.Types.ObjectId, ref: 'users' },
//       partnerId: { type: mongoose.Types.ObjectId, ref: 'partners' },
// })

// module.exports = mongoose.model ('chats', chatSchema)

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },  
  },{
    timestamps: true
  });


  module.exports = mongoose.model('messages', messageSchema);


