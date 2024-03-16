const Chat = require("../model/chatModel");
const getChatService =async (req, res)=>{
const chatId = req.params.id
const chat = await Chat.findById(chatId)
.populate("users", "-passwords")
res.status(200).send(chat)
}

module.exports = getChatService
