const bcrypt = require('bcrypt-inzi');
const jwt = require('../utils/jwt');
const User = require('../model/userModel');
const Joi = require('joi');
const { getHash, getHashVerify } = require('../utils/GlobalFunctions');
const { mail } = require('../utils/mail');
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);
let cell, otp = ""
// Define the password validation schema
const passwordValidation = Joi.string()
  .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}":;<>,.?~\\-]).{8,}$'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least 1 upper case, 1 number, 1 special character, and be exactly 8 characters long.'
  });

// Define the schema for updating a user
const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: passwordValidation, // password validation 
  phone: Joi.string()
}).or('name', 'email', 'password', 'phone');

const validatePhone = Joi.object({
  phone: Joi.string().required()
})
const validateOtp = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().required().length(4),
  oldHash: Joi.string().required()
})

const validatePasswords = Joi.object({
  newPassword: passwordValidation,
  confirmPassword: passwordValidation,
  phone: Joi.string().required()
})
// Define the schema for user signup
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: passwordValidation, // password validation 
  phone: Joi.string().required()
});

// Define the schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Middleware to validate login request


const authController = {
  async signup(req, res) {
    try {
      // Validate the request body using the signupSchema
      const { error } = signupSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { name, email, password, phone } = req.body;

      // Check if required fields are missing

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.stringToHash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone
      });

    //   // Save the user in the database
     const user =  await newUser.save()
     delete user._doc.password


      // Generate a JWT token and set it as a cookie
      const token = jwt.sign(email);
      res.json({user,token ,message: "Successfully SignUp",success:true, });
      
      // mail("hasnaindeveloper786@gmail.com", email, "Verify Email", "Jaldi Focus Kro");
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async login(req, res) {
    try {
      // Validate the request body using the loginSchema
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });


      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.varifyHash(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Wrong password" });
      }
      delete user._doc.password
      // Generate a JWT token and set it as a cookie
      const token = jwt.sign(email);
      res.json({ token, success:true, user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      // Validate the request body using the updateUserSchema
      const { error } = updateUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });
      const isPasswordValid = await bcrypt.varifyHash(req.body.password, user.password);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect password!" });
      }

      // Update user properties if provided in the request body
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.password) {
        user.password = await bcrypt.stringToHash(req.body.password, 10);
      }
      if (req.body.phone) {
        user.phone = req.body.phone;
      }

      // Save the updated user
      await user.save();

      res.json({ message: "User updated successfully", success:true, user });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },
  async getOtp(req, res) {
    try {
      const { error } = validatePhone.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const { phone } = req.body;

      // Check if the user exists
      const user = await User.findOne({ phone });;
      if (!user) {
        return res.status(400).json({ message: "Invalid Phone!" })
      }
      if (user) {
        for (let i = 0; i <= 3; i++) {
          otp += Math.ceil(Math.random() * 8)
        }
        const otpHash = getHash(otp + phone)
        res.status(200).json({ otp, phone, otpHash })
        otp = ""

        //  await  client.messages 
        //         .create({ 
        //            body: 'text me!', 
        //            from: '+12674607985',       
        //            to: '+923172922032' 
        //          })
      }
    }
    catch (e) { res.status(500).json({ message: e}) }
  },
  async verifyOtp(req, res) {
    const { error } = validateOtp.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { otp, phone, oldHash } = req.body;
    console.log(getHashVerify(otp + phone, oldHash))
    if(getHashVerify(otp + phone, oldHash)){
      return res.status(200).json({message:"Otp varified", success:true})
    }
    if(!getHashVerify(otp + phone, oldHash)){
      return res.status(400).json({message:"Invalid OTP", success:false})
    }
  },
  async updatePassword(req, res) {
    const { error } = validatePasswords.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    const { newPassword, confirmPassword, phone } = req.body
    const user = await User.findOne({ phone })
    console.log(user,"before save")
    if (newPassword === confirmPassword) {
      user.password = await bcrypt.stringToHash(newPassword, 10);
      await user.save();
      console.log(user,"after save")
      return res.json({ message: "password updated successfully" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Confirm password incorrect!" });
    }

  },
  async uploadUserProfile(req,res){
   res.status(200).json({url:req?.file})
  },
  async deleteUser(req, res){
    const {error} = validatePhone.validate(req.body)
    if(error){
      res.status(400).json({message:error.details[0].message})
    }
    const {phone} = req.body
    const user =await User.findOne({phone})
    await User.deleteOne({phone})
console.log("delete user body", user)
  },
  async getUser(req, res) {
    const users = await User.find();
    const secureUsers = []
     users.map(user=>{
      delete user._doc.password
      secureUsers.push(user)
    })
    return res.status(200).json(secureUsers);
  }
};
module.exports = authController;
