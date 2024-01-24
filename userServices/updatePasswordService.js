const { validatePasswords } = require("../JoiSchemas/JoiUserSchema");
const User = require("../model/userModel");
const bcrypt = require("bcrypt-inzi");
const updatePasswordService = async (req, res) => {
  const { error } = validatePasswords.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let { password } = req.body;
  password = await bcrypt.stringToHash(password, 10);
  await User.findByIdAndUpdate(req.user._id, { password });
  return res.json({ message: "password updated successfully", success: true });
};
module.exports = {
  updatePasswordService,
};
