const Chat = require("../model/chatModel");

const userChatsService = async (req, res) => {
  const id = req.user._id;
  console.log(id)
  try {
    const allChats = await Chat.find({
      users: id,
      // isGroupChat:false
    })
      .populate('users', '-password')
      .populate("admin", "-password")
      .populate("lastMessage")
      .populate("lastMessage.sender", "-password")
      .sort({"updatedAt":-1})
      
    if (allChats.length > 0) {
      return res.status(200).send(allChats);
    } else {
      return res.status(200).send({ message: 'No Chats Found'});
    }
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};
module.exports = userChatsService;
