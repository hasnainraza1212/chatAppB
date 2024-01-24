const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  groupName: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupIcon: { type: String },
  admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;