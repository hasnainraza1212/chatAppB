const express = require('express')
const jwt = require("jsonwebtoken")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express()
const {Server} = require("socket.io")
const http = require("http").createServer(app)
require('dotenv').config({path:'./.env'})
const connectDb = require('./db/db')
const UserRouter = require('./routes/userRoutes')
const cors = require('cors')
const port =  process.env.PORT || 3000 
const chatRouter = require('./routes/chatRouter')
const passport = require('passport')
const User = require('./model/userModel')
const { default: mongoose } = require('mongoose')
const io = new  Server(http,  {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }, 
})
io.on('connection', (socket) => {
    console.log(`A user connected witth id: ${socket.id}`)
})

connectDb()
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }))
app.use(express.json())

app.use('/api/v1/user',UserRouter);
app.use('/api/v1',UserRouter);
app.use('/api/v1/chat',chatRouter);

app.use(passport.initialize());

const handleOauth20 = async (data, type, res, next) => {
  try {
    const { _id, email } = data;
    let message;
    let severity;
    let token = "";
    const isUserExist = await User.findOne({ _id, email });

    if (type === "login") {
      if (!isUserExist) {
        message = "Create account please!";
        severity = "error";
        return res.redirect(
          `http://localhost:5173/sign-up?&message=${message}&severity=${severity}`
        );
      }
      token = jwt.sign({ _id: isUserExist._id }, process.env.JWTSECRETKEY, {
        expiresIn: "24h",
      });
      message = "Logged in successfully!";
      severity = "success";
      return res.redirect(
        `http://localhost:5173/?token=${token}&message=${message}&severity=${severity}`
      );
    }

    if (isUserExist) {
      console.log(isUserExist)
      message = "User already exist";
      severity = "error";
      return res.redirect(
        `http://localhost:5173/sign-in/?message=${message}&severity=${severity}`
      );
    }

    const user = await User.create(data);
    token = jwt.sign({ _id: user._id }, process.env.JWTSECRETKEY, {
      expiresIn: "24h",
    });
    message = "SignUp successfully";
    severity = "success";
    return res.redirect(`http://localhost:5173/?message=${message}&token=${token}&severity=${severity}`);
  } catch (err) {
    next(err);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        // Your logic here
        done(null, profile);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Define routes
app.get("/login/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: Buffer.from("login").toString("base64"),
  })(req, res, next);
});

app.get("/signup/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: Buffer.from("signup").toString("base64"),
  })(req, res, next);
});

app.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res, next) => {
    try {
      const state = Buffer.from(req.query.state, "base64").toString("ascii");
      const { id, displayName, emails } = req.user;
      const data = {
        _id: new mongoose.Types.ObjectId(id.padEnd(24, 0)),
        name: displayName,
        email: emails[0].value,
        isEmailVerified: emails[0].verified,
      };
      handleOauth20(data, state, res, next);
    } catch (err) {
      next(err);
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "Internal Server Error" });
});



http.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
