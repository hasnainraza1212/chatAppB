const User = require("../model/userModel");

const getUsersService = async(req, res)=>{
    const page = req.query.page || 1
    const limit = 5 
    const skip = (page- 1)*limit
    const users = await User.find()
    .select("-password")
    .sort("-1")
    .limit(limit)
    .skip(skip)
    return res.status(200).json(users);
}

module.exports = getUsersService