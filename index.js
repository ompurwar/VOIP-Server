'use strict';
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('ssl/server.key', 'utf8');
var certificate = fs.readFileSync('ssl/server.cert', 'utf8');
var bodyParser = require('body-parser');
var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();
var path = require('path');
var serveStatic = require('serve-static');
// attaching bodyparser middleware 
app.use(bodyParser.json());

// setting header
app.use(function (req, res, next) {
    //     Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //     Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //     Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //     Set to true if you need the website to include cookies in the requests
    //     sent
    //     to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    //     Pass to next layer of middleware
    next();
});
app.use('/rec', serveStatic(path.join(__dirname, 'recorder/')))
// to be sent with your certificate request
// A challenge password []: kals

// setting up the server
// var server = app.listen(80, function () {
//     console.log('listening to the port\t:' + server.address().port);
// });
// Json validator middle-ware

app.get('/', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + '/index.html');
});
app.get('/doc', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + '/doc.html');
});
app.get('/mic', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + '/mic.html');
});
app.get('/include/script.js', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + '/include/script.js');
});
app.get('/include/style.css', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + '/include/style.css');
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
