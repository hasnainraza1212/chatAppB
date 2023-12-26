const accessChatService = require("../chatServices/accessChatService")
const userChatsService = require("../chatServices/userChatsService")
const createGroupChatService = require("./../chatServices/createGroupChatService")
const userGroupChatService = require("./../chatServices/userGroupChatService")
const deleteChatService = require("./../chatServices/deleteChatService")
const updateGroupNameService = require("../chatServices/updateGroupNameService")
const addGroupMemberService = require("../chatServices/addGroupMemberService")
const removeGroupMemberService = require("../chatServices/removeGroupMemberService")
const chatController = {
async accessChat(req, res){
await accessChatService(req, res)
},
async  userChats(req, res){
  await userChatsService(req, res)
},
async userGroupChats(req, res){
await userGroupChatService(req, res)
},
async createGroupChat(req, res){
await createGroupChatService(req, res)
},
async deleteChat(req, res){
await deleteChatService(req, res)
},
async updateGroupName(req, res){
  await updateGroupNameService(req, res)
},
async addGroupMember(req, res){
  await addGroupMemberService(req, res)
},
async removeGroupMember(req, res){
  await removeGroupMemberService(req, res)
}
}
module.exports = chatController
