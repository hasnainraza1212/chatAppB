const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  password: { type: String, required: false },
  profilePicture: { type: String },
  isEmailVerified :{type:Boolean, default :false}
},
{
  timestamps:true
}
);
const User = mongoose.model("User", UserSchema);
module.exports = User
