const express = require('express')
const app = express()
const {Server} = require("socket.io")
const http = require("http").createServer(app)
require('dotenv').config({path:'./.env'})
const connectDb = require('./db/db')
const UserRouter = require('./routes/userRoutes')
const cors = require('cors')
const port =  process.env.PORT || 5000 
const cookieParser = require('cookie-parser');
const chatRouter = require('./routes/chatRouter')
const io = new  Server(http)
const { addUser, getUser, deleteUser, getUsers } = require("./users")
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST"]
}))
connectDb()
app.use(express.json())
app.use('/api',UserRouter);
app.use('/api',chatRouter);
io.on('connection', (socket) => {
   console.log("socket_id", socket.id)
  socket.on("join_chat", {name, room}, cb=>{
    const {user, error} = addUser(socket.id, name, room)
    if (error) return cb(error)
    socket.join(room);
    socket.in(room).emit("notify", {title:`${user.name} joined the chat!`})
    io.in(room).emit("allUsers", getUsers(room))
    cb()
  })
})


http.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})