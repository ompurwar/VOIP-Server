'use strict';
// https://devpost.com/software/mosca
var mosca = require('mosca');
var http = require('http'),
    httpServer = http.createServer()

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
    console.log('[Published]', packet.topic, packet.retain);
});

MQTTserver.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    console.log('[ready] Mosca server is up and running');

}

MQTTserver.attachHttpServer(httpServer);

httpServer.listen(1800);