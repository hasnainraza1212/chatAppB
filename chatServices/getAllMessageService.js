const Message = require("./../model/messageModel")
const Chat = require("./../model/chatModel")
const getAllMessageService = async (req, res) => {
    try {
        const chatId = req.params.chatId
        const isChatExists = await Chat.findById(chatId)
        if (!isChatExists) {
            return res.status(404).send({ message: "Chat not found!" })
        }
        let getAllMessages = await Message.find({ chat: chatId })
            .populate("sender")
            // .populate({
            //     path: "chat",
            //     populate: [
            //         { path: "admin users", select: "-password" },
            //         { path: "lastMessage" },
            //         {
            //             path: "lastMessage",
            //             populate: "sender",
            //             select: "-password"
            //         }
            //     ],

            // })
      

        return res.status(200).send(getAllMessages)
    } catch (error) {
        res.status(500).send({ message: "Internal server error!", error })
    }
}
module.exports = getAllMessageService