require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (err) => {
    console.log("mongoose connection ERROR: " + err.message);
});

mongoose.connection.once('open', () => {
    console.log("MongoDB connected");
});

// Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");
const app = require('./app');

const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

const io = require("socket.io")(server);
const jwt = require('jwt-then');
const Chatroom = require("./models/Chatroom");

const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next)=>{
    

    try {
        
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
    
        next();
    } catch(err) {}
});

io.on('connection', (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on('disconnect', ()=>{
        console.log("Disconnected: " + socket.userId);

    });

    socket.on("joinRoom", ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log("A user joined chatroom: " + chatroomId);
    });
    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    socket.on("chatroomMessage", async ({chatroomId, message}) => {
        if (message.trim().length > 0){
            const user = await User.findOne({ _id: socket.userId });
            const messageObj = new Message({
                chatroom: chatroomId, 
                user: socket.userId, 
                message,

            });
            io.to(chatroomId).emit("newMessage", {
                message, 
                name: user.name,
                userId: socket.userId,
            });

            await messageObj.save();
        }
      
    });
});