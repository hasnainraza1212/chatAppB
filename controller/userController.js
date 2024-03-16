const User = require("../model/userModel");
const { getHash, getHashVerify } = require("../utils/GlobalFunctions");
const { mail } = require("../utils/mail");
const {
  validatePhone,
  validateOtp,
} = require("../JoiSchemas/JoiUserSchema");
const { loginService } = require("../userServices/loginService");
const { signUpService } = require("../userServices/signUpService");
const { updateUserService } = require("../userServices/updateUserService");
const { updatePasswordService } = require("../userServices/updatePasswordService");
const { deleteUserService } = require("../userServices/deleteUserService");
const getUsersService = require("../userServices/getAllUsersService");
const getLoggedInUserService = require("../chatServices/getLoggedInUserService");
const getContactsService = require("../userServices/getContactsService.js");
const addContactService = require("../userServices/addContactService.js");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);
let cell,
  otp = "";

const authController = {
  async signup(req, res) {
   await signUpService(req, res)
  },

  async login(req, res) {
      await loginService(req, res)
  },
  async getLoggedInUser(req, res){
      await getLoggedInUserService(req, res) 
  },

  async updateUser(req, res) {
   await updateUserService(req, res)
  },
  async generateOtp(req, res) {
    try {
      const { error } = validatePhone.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const _id = req.user._id;

      // Check if the user exists
      const user = await User.findOne({ _id });

      if (user) {
        for (let i = 0; i <= 3; i++) {
          otp += Math.ceil(Math.random() * 8);
        }
        const otpHash = getHash(otp + phone);
        res.status(200).json({ otp, phone, otpHash });
        otp = "";

        //  await  client.messages
        //         .create({
        //            body: 'text me!',
        //            from: '+12674607985',
        //            to: '+923172922032'
        //          })
      }
    } catch (e) {
      res.status(500).json({ message: e });
    }
  },
  async verifyOtp(req, res) {
    const { error } = validateOtp.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { otp, phone, oldHash } = req.body;
    if (getHashVerify(otp + phone, oldHash)) {
      return res.status(200).json({ message: "Otp varified", success: true });
    }
    if (!getHashVerify(otp + phone, oldHash)) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
  },
  async updatePassword(req, res) {
    await updatePasswordService(req, res)
  },
  async uploadUserProfile(req, res) {
    res.status(200).json({ url: req?.file });
  },
  async deleteUser(req, res) {
    await deleteUserService(req, res)
  },
  async getUsers(req, res) {
    await getUsersService(req, res)
  }
  ,
  async searchContacts(req, res) {
    await getContactsService(req, res)
  }
  ,
  async addContact(req, res) {
    await addContactService(req, res)
  }
};
module.exports = authController;
