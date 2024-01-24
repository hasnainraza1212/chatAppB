const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const getLoggedInUserService = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).send({ message: "token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    const user =await User.findOne({ _id: decoded._id }).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({
          message:
            "Unauthorized, Invalid token provided, no user associated with the token!",
        });
    }
    console
    res.status(200).send({ message: "yeah we got u!", user, success:true});
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
module.exports = getLoggedInUserService;
