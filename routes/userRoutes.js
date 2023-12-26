const express = require('express');
const upload = require('../utils/multer')
const authController = require('../controller/userController');
const jwt = require("./../utils/jwt");
const {verifyToken} = jwt;
const userRouter = express.Router()
userRouter.post('/signup',authController.signup)
userRouter.post('/login',authController.login)
userRouter.put('/update/user', verifyToken,authController.updateUser)
userRouter.post('/user/phone/otp', verifyToken,authController.getOtp)
userRouter.post('/update/user/verify/phone/otp', verifyToken,authController.verifyOtp)
userRouter.post('/update/user/password',verifyToken,authController.updatePassword)
userRouter.post('/user/profile/picture/upload',verifyToken, upload.single('file'),authController.uploadUserProfile)
userRouter.post('/delete/user',verifyToken,authController.deleteUser)
userRouter.get('/getUsers', verifyToken,authController.getUser)
module.exports = userRouter;
