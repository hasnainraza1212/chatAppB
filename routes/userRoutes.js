const express = require('express');
const upload = require('../utils/multer')
const authController = require('../controller/userController');
const jwt = require("./../utils/jwt");
const {verifyToken} = jwt;
const userRouter = express.Router()
userRouter.post('/signup',authController.signup)
userRouter.post('/login',authController.login)
userRouter.post('/get-logged-in-user',authController.getLoggedInUser)
userRouter.patch('/update', verifyToken,authController.updateUser)
userRouter.post('/generate-otp', verifyToken,authController.generateOtp)
userRouter.post('/verify-otp', verifyToken,authController.verifyOtp)
userRouter.put('/update-password',verifyToken,authController.updatePassword)
userRouter.post('/upload-profile',verifyToken, upload.single('file'),authController.uploadUserProfile)
userRouter.delete('/delete',verifyToken,authController.deleteUser)
userRouter.get('/getAllUsers',authController.getUsers)
userRouter.post('/search-contacts', authController.searchContacts)
userRouter.post('/add-contact', verifyToken,authController.addContact)
userRouter.get('/contacts',verifyToken,authController.getContact)


module.exports = userRouter;
