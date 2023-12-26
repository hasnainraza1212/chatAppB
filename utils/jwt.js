const jwt = require('jsonwebtoken')
const secretKey = process.env.JWTSECRETKEY
const expiresIn = process.env.JWTEXPIRY
const User = require("./../model/userModel")
const jwtConfig = {
    sign(email){
        const token = jwt.sign({email},secretKey, {expiresIn})
        return token
    },
  
    async verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }
    
        try {
          const decoded = jwt.verify(token,secretKey);

          const user = await User.findOne({email:decoded.email})
          req.user = user; // Add the decoded payload to the request object
          next();
        } catch (error) {
          return res.status(401).json({ message: 'Invalid token' });
        }
      }
}

module.exports = jwtConfig
