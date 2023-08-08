
const chatCollection = require("../model/chatModel");

const getMessages = async (req, res) => {
    try {
      const messages = await chatCollection.find().populate('userId', '_id'); // Populate the userId field with only the _id field of the referenced user
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };


const AddMessages = async (req, res) => {
    try {
      const { sender, content ,userId} = req.body;
      // const userId = req.UserId; // Assuming you have the user ID from the request
  
      const existingUser = await chatCollection.findOne({ userId });
  
      if (existingUser) {
        const newMessage = new chatCollection({ sender, content,userId });
        await newMessage.save();
        res.status(201).json(newMessage);
      } else {
        const newMessage = new chatCollection({ sender, content,userId });
        await newMessage.save();
        res.status(201).json(newMessage);
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports = {
    getMessages,AddMessages
  }







  // const getMessages = async (req, res) => {
//     try {
//       const messages = await chatCollection.find();
//       res.json(messages);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   };

//   const AddMessages = async (req, res) => {
//     try {
//       const { sender, content } = req.body;
//       const newMessage = new chatCollection({ sender, content });
//       await newMessage.save();
//       res.status(201).json(newMessage);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   };
