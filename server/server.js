const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'public', "index.html");
const port = process.env.PORT || 3000;
const https = require('http');
const fs = require('fs');
var io = require('socket.io')(https);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

var twilio = require('twilio')(
    'AC6bac44af8fdbae0541ed22cf4be1fe2d',
    '3f1c078c2560f6e8b69b88248e67a0c0'
);

io.on('connection', function(socket) {
    socket.on('join', function(room) {
        var clients = io.sockets.adapter.rooms[room];
        var numClients = typeof clients !== 'undefined' ? clients.length : 0;
        if (numClients == 0) {
            socket.join(room);
        } else if (numClients == 1) {
            socket.join(room);
            socket.emit('ready', room);
            socket.broadcast.emit('ready', room);
        } else {
            socket.emit('full', room);
        }
    });
    socket.on('token', function() {
        twilio.tokens.create(function(err, response) {
            if (err) {
                console.log(err);
            } else {
                socket.emit('token', response);
            }
        });
    });
    socket.on('candidate', function(candidate) {
        socket.broadcast.emit('candidate', candidate);
    });
    socket.on('offer', function(offer) {
        socket.broadcast.emit('offer', offer);
    });
    socket.on('answer', function(answer) {
        socket.broadcast.emit('answer', answer);
    });
});

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
};
const server = https.createServer(options, app)
    .listen(3000, function() {
        console.log('listening on *:3000');
    });

// index.js
// var express = require('express');
// var app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// var twilio = require('twilio')(
//     'AC6bac44af8fdbae0541ed22cf4be1fe2d',
//     '3f1c078c2560f6e8b69b88248e67a0c0'
// );

// io.on('connection', function(socket) {
//     socket.on('join', function(room) {
//         var clients = io.sockets.adapter.rooms[room];
//         var numClients = typeof clients !== 'undefined' ? clients.length : 0;
//         if (numClients == 0) {
//             socket.join(room);
//         } else if (numClients == 1) {
//             socket.join(room);
//             socket.emit('ready', room);
//             socket.broadcast.emit('ready', room);
//         } else {
//             socket.emit('full', room);
//         }
//     });
// });

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });

// http.listen(3000, function() {
//     console.log('listening on *:3000');
// });