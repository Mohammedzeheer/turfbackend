const chatCollection = require("../model/chatModel");

///<<<<<<<<<<<<<<<< GET MESSAGES TO ADMIN ALL CHATS OF USERS BY USERiD  >>>>>>>>>>>>>>
const getMessages = async (req, res) => {
  try {
    const messages = await chatCollection.find().populate("userId", "_id");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

///<<<<<<<<<<<<<<<<<<<<<<<   ADD MESSAGE OF ADMIN  >>>>>>>>>>>>>>>>>>>>>>>>>>>
const AddMessages = async (req, res) => {
  try {
    const { sender, content, userId } = req.body;
    const newMessage = new chatCollection({ sender, content, userId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMessages,
  AddMessages,
};
