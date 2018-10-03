'use strict';
var bodyParser = require('body-parser');

var express = require('express');
var app = express();
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





// setting up the server
var server = app.listen(80, function () {
    console.log('listening to the port\t:' + server.address().port);
});
// Json validator middle-ware

app.get('/', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname+'/index.html');
});