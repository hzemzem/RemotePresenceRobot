const SignalServer = require('react-rtc-real/server/SignalServer.js');

const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'public', "index.html");
const port = process.env.PORT || 3030;
const https = require('http');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const server = https.createServer(app);

const signal = new SignalServer({ server });
signal.connect();

app.listen(port, () => {
    console.log('Server is up!');
});