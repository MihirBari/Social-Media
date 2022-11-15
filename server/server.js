import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    path : "/socket.io",
    cors : {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders:  ["content-type"]
    }
})

//db 

mongoose.connect(process.env.DATABASE
).then(() => console.log("DB Connected"))
    .catch(err => console.log("error", err));

//middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: [process.env.CLIENT_URL],
}));

// auto load route . we map all the files as middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))

//socketio
io.on('connect', (socket)=>{
    console.log("Socket.IO",socket.id);
});

//socket
io.on("connect", (socket)=>{
    socket.on("new-post", (newPost)=>{
    socket.broadcast.emit("new-post",newPost )
    });
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`server runnig on port ${port}`))