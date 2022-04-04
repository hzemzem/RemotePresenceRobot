const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'public', "index.html");
const port = process.env.PORT || 3000;
const https = require('http');
const fs = require('fs');
var io = require('socket.io')(https);
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

server.listen(process.env.PORT || 3000, function() {
    console.log('listening on port 3000');
});

io.on('connection', function(socket) {
    socket.on('join', function(data) {
        socket.join(data.roomId);
        socket.room = data.roomId;
        const sockets = io.of('/').in().adapter.rooms[data.roomId];
        if (sockets.length === 1) {
            socket.emit('init')
        } else {
            if (sockets.length === 2) {
                io.to(data.roomId).emit('ready')
            } else {
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
            }

        }
    });
    socket.on('signal', (data) => {
        io.to(data.room).emit('desc', data.desc)
    });
    socket.on('disconnect', () => {
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room) {
            io.to(socket.room).emit('disconnected')
        }
    });
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});