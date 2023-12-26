const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const Message = require("../model/messageModel");
 const accessChatService= async (req, res) => {
    const  userId  = req.params.id;
    const id = req.user._id
    try{
      const receiverExist = await User.findById({_id:userId})
      if (!receiverExist){
        return res.status(404).send({message:"User not exists!"})
      }
      const isChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [userId, id] },
      })
        .populate('users', '-password', User)
        .populate('lastMessage', Message)
        .populate('lastMessage.sender', '-password', User);
      if (isChat) {
        return res.status(200).send(isChat);
      } 
      else {
        const newChat =await Chat.create({
        isGroupChat: false,
        users: [userId, id],
      })
          const fullChat = await Chat.findOne({ _id: newChat._id })
          .populate("users", "-password")
          .populate("lastMessage")
          .populate("lastMessage.sender")
          return res.status(200).send(fullChat);
      }
    }
    catch (error) {
      if(error.kind === "ObjectId"){
        return res.status(404).send({message:"Invalid User Id Provided"})
      }
      res
        .status(500)
        .send({ message: 'Internal Server Error, Failed to create Chat', error });
    }

  }
module.exports = accessChatService;
