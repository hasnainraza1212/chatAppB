const Chat = require("../model/chatModel")
const updateGroupNameService =async (req, res)=>{
    try{
    const id = req.params.id;
    const {groupName} = req.body
    const updateChat = await Chat.findByIdAndUpdate(id, {groupName},{new:true})
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("lastMessage")
    .populate("lastMessage.sender", "-password")
    if(!updateChat){
        return res.status(404).send({message:"chat not found"})
    }

    res.status(200).send({updateChat, success:true, message:"chat created successfully"})    
}catch(error){
    res.status(500).send({message:"Internal server error", error})
}

}
module.exports = updateGroupNameService