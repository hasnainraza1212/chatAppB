const jwt = require("./../utils/jwt")
const {verifyToken} = jwt;
const chatController = require("../controller/chatController")
const express = require("express")
const chatRouter = express.Router()
chatRouter.post("/create/chat/:id",verifyToken ,chatController.accessChat)
chatRouter.post("/create/group/chat", verifyToken, chatController.createGroupChat)
chatRouter.get("/chats",verifyToken ,chatController.userChats)
chatRouter.get("/chats/group",verifyToken, chatController.userGroupChats)
chatRouter.post("/chat/delete/:id", verifyToken, chatController.deleteChat)
chatRouter.post("/chat/update/group/name/:id", verifyToken, chatController.updateGroupName)
chatRouter.post("/chat/add/group/member/:id", verifyToken, chatController.addGroupMember)
chatRouter.post("/chat/remove/group/member/:id", verifyToken, chatController.removeGroupMember)

module.exports = chatRouter
