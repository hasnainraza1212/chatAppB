const Chat = require("./../model/chatModel")
const userGroupChatService = async(req, res) =>{
const id = req.user._id;
try{
    const getChats = await Chat.find({
        users:id,
        isGroupChat:true
    })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("lastMessage")
    .populate("lastMessage.sender", "-password")
    res.status(200).send(getChats)
}catch(error){
    res.status(400).send({message:"chats not found"})
}

}

module.exports = userGroupChatService