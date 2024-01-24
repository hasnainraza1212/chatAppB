const { updateUserSchema } = require("../JoiSchemas/JoiUserSchema");
const User = require("../model/userModel");
const bcrypt = require("bcrypt-inzi");
const updateUserService = async(req, res)=>{
    try {
        // Validate the request body using the updateUserSchema
        const { error } = updateUserSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
  
        // Check if the user exists
        const user = await User.findOne({ _id: req.user._id });
  
        const isPasswordValid = await bcrypt.varifyHash(
          req.body.password,
          user.password
        );
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Incorrect password!" });
        }
  
        let reqData =
          Object.keys(req.body).length > 0 &&
          Object.keys(req.body).filter((field) => field != "password");
        if (reqData.length < 1) {
          return res.send({
            message: "No data provided",
          });
        }
        delete req.body["password"];
  
        // Update user properties if provided in the request body
  
        const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
          new: true,
        });
  
        // Save the updated user
        res.json({
          message: "User updated successfully",
          success: true,
          updatedUser,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
}
module.exports = {updateUserService}