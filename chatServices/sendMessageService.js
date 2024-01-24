const Chat = require("../model/chatModel");
const Message = require("../model/messageModel")
const sendMessageService = async(req, res)=>{
try{
const chatId = req.query.chatId;
const id = req.user._id
const {content} = req.body
const createMessage =await Message.create({
    content, 
    sender:id,
    chat:chatId
})
const getMessage =await Message.findById(createMessage._id)

  .populate("sender" , "-password")
  .populate({
    path :"chat",
    populate:{
        path :"users admin",
        select:"-password"
    }
  })
  const chat = await Chat.findByIdAndUpdate(chatId, {lastMessage:createMessage}, {new :true})

res.status(200).send({message:getMessage})

}catch(error){
    res.status(500).send({message:"Internal Server Error!", error})
}
}

module.exports = sendMessageService