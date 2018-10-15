'use strict';
// https://devpost.com/software/mosca
var mosca = require('mosca');
var fs = require('fs');
var Chalk = require('./chalk');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('ssl/server.key', 'utf8');
var certificate = fs.readFileSync('ssl/server.cert', 'utf8');

// setting credentials object
var credentials = {
    key: privateKey,
    cert: certificate
};
// creating chalk instance
var myChalk = new Chalk();

var httpServer = http.createServer();
var httpsServer = https.createServer(credentials);

var ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
};

var moscaSettings = {
    port: 41235,
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: 'mongodb://localhost:27017/mqtt'
    }
};

var MQTTserver = new mosca.Server(moscaSettings);





MQTTserver.on('clientConnected', function (client) {
    console.log('[client connected]', client.id);
});

// fired when a message is received

MQTTserver.on('published', function (packet, client) {
    console.log(myChalk.info('[Published]' + packet.topic + 'Packet len = ' + packet.length));
})

MQTTserver.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    console.log('[ready] Mosca server is up and running');
    
}

MQTTserver.attachHttpServer(httpServer);
MQTTserver.attachHttpServer(httpsServer);
httpServer.listen(1800);
httpsServer.listen(2000);