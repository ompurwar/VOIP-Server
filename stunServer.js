'use strict';
const {
    Transform
} = require('stream');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const fs = require('fs');
const Readable = require('stream').Duplex;
const bufferAlloc = require('buffer-alloc');
const Speaker = require('speaker');
//creating speaker instance
const mySpeaker = new Speaker({
    channels: 1, // 2 channels
    bitDepth: 16, // 16-bit samples
    sampleRate: 8000, // 44,100 Hz sample rate
    samplesPerFrame: 1024
})

var counter = 0;
// the Readable "_read()" callback function
var time = Date.now();

server.on('message', (msg, rinfo) => {
    counter++;
    console.log(`server got: ${msg} ${counter}from ${rinfo.address}:${rinfo.port}`);

    server.send(JSON.stringify({
        "protocol": 'stun',
        "ip": rinfo.address,
        "port": rinfo.port
    }), rinfo.port, rinfo.address, function () {
        console.log("packet send")
    });

});

server.on('error', (err) => {
    console.log(`server error:\n${ err.stack }`);
    server.close();
    //mySpeaker.close(flush);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234, 'hello-pc');