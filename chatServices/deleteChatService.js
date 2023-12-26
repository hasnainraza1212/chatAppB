const Chat = require("./../model/chatModel")
const deleteChatService = async(req, res)=>{
const id = req.params.id;
try{
    const deleteChat =await Chat.findByIdAndDelete(id)
    res.status(200).send(deleteChat)
}catch(error){
    res.status(500).send({message:"Internal server error!", error})
}
}
module.exports = deleteChatService