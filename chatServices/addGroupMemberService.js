const { findOne } = require("../model/userModel")
const Chat = require("./../model/chatModel")
const addGroupMemberService = async(req, res)=>{
  try{
    let testingMembers = []
    let members = []
    const id = req.params.id
    let {userId} = req.body
    testingiD = userId.toString()
    const chat = await Chat.findOne({_id:id})
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("lastMessage")
    .populate("lastMessage.sender", "-password")
    if(!chat){
        return res.status(404).send({message:"Chat not found!"})
    }
        chat.users.map(member=>{
            testingMembers.push(member?._id.toString()) 
            members.push(member?._id)
        })
    if (testingMembers?.includes(testingiD)){
        return res.status(400).send({ message: "User is already part of the group" })
    }

        const addUser = await Chat.findByIdAndUpdate(id, {users:[...members, userId]}, {new:true})
        .populate("users", "-password")
        .populate("admin", "-password")
        .populate("lastMessage")
        .populate("lastMessage.sender")
        return res.status(200).send(addUser)
  }catch(error){
    res.status(500).send({message: "Internal server Error", error})
  }
}

module.exports = addGroupMemberService