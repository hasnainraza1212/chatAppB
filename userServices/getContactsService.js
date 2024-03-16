const User = require("../model/userModel")

const getContactsService = async(req, res)=>{
    const query  = req.query.q
const contacts=await User.find({  $or: [
    { name: { $regex: query, $options: 'i' } }, // Search by username
    { email: { $regex: query, $options: 'i' } },    // Search by email
    { phone: { $regex: query, $options: 'i' } } // Search by phone number
  ]}).limit(10)
 return res.status(200).send(contacts)
}



module.exports=getContactsService