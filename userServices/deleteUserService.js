const { validatePhone } = require("../JoiSchemas/JoiUserSchema");
const User = require("../model/userModel");

const deleteUserService = async(req, res)=>{
   const user = await User.findByIdAndDelete(req.user._id);
   return res.send({message:"user delete succesfully", success:true, user})
}
module.exports = {deleteUserService}