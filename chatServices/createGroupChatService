const Chat = require("../model/chatModel")
const createGroupChatService = async (req, res) => {
  let { groupName, members } = req.body
  const id = req.user._id
  members = members.filter(member=>member!=id)
 try{
  const newChat =await Chat.create({
    groupName,
    isGroupChat:true,
    admin:[id],
    users:[...members, id]
  })
  const getChat = await  Chat.findOne({
    _id:newChat._id
  })
  .populate("admin", "-password")
  .populate("users", "-password")
  res.status(200).send(getChat)

 }catch(error){
  res.status(400).send({message:"internal server error", error})
 }
  
}

module.exports = createGroupChatService
