const Chat = require("../model/chatModel");
const getChatService = async (req, res) => {
  const chatId = req.params.id;
  try {
    const chat = await Chat.findById(chatId).populate("users", "-passwords");
    return res.status(200).send(chat);
  } catch (error) {
    return res
      .status(500)
      .send({
        message: "Internal server error: Failed to get Chat.",
        success: false,
        data: {},
      });
  }
};

module.exports = getChatService;
