const { signupSchema } = require("../JoiSchemas/JoiUserSchema");
const User = require("../model/userModel");
const bcrypt = require("bcrypt-inzi");
const jwtConfig = require("../utils/jwt");
const { mail } = require("../utils/mail");
const { content } = require("../utils/GlobalFunctions");

const signUpService = async(req, res)=>{
    try {
        // Validate the request body using the signupSchema
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
  
        const { name, email, password } = req.body;

  
        // Check if required fields are missing
  
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log(existingUser)
          return res.status(400).json({ message: "email already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.stringToHash(password, 10);
  
        // Create a new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
  
        //   // Save the user in the database
        const user = await newUser.save();
        delete user._doc.password;
  
        // Generate a JWT token and set it as a cookie
        const token = jwtConfig.sign(user._id);
       await mail("hr961992@gmail.com", email, "confirm your email!", content)
      return  res.json({ user, token, message: "Successfully SignUp", success: true });
  
        // mail("hasnaindeveloper786@gmail.com", email, "Verify Email", "Jaldi Focus Kro");
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }



}
module.exports= {signUpService}