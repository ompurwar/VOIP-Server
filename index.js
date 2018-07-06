'use strict';
const {
    Transform
} = require('stream');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const fs = require('fs');
const Readable = require('stream').Duplex
const bufferAlloc = require('buffer-alloc')
const Speaker = require('speaker')
    //creating speaker instance
const mySpeaker = new Speaker({
    channels: 1, // 2 channels
    bitDepth: 16, // 16-bit samples
    sampleRate: 8000, // 44,100 Hz sample rate
    samplesPerFrame: 1024
})


const baseChartoInt = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
    a: 26,
    b: 27,
    c: 28,
    d: 29,
    e: 30,
    f: 31,
    g: 32,
    h: 33,
    i: 34,
    j: 35,
    k: 36,
    l: 37,
    m: 38,
    n: 39,
    o: 40,
    p: 41,
    q: 42,
    r: 43,
    s: 44,
    t: 45,
    u: 46,
    v: 47,
    w: 48,
    x: 49,
    y: 50,
    z: 51,
    0: 52,
    1: 53,
    2: 54,
    3: 55,
    4: 56,
    5: 57,
    6: 58,
    7: 59,
    8: 60,
    9: 61,
    '+': 62,
    '/': 63
};



const muLawDecodeTransform = new Transform({
    transform(chunk, encoding, callback) {

        var temp = chunk;
        var chunkLength = chunk.length << 1
        var buf = Buffer.allocUnsafe(chunkLength);
        var index;

        for (index = 0; index < chunk.length; ++index) {
            buf.writeInt16BE(aw2linear(chunk[index]), index << 1);
        }

        this.push(buf);
        callback();
    }
});
//amplification transform
const AmplificationTransform = new Transform({
    transform(chunk, encoding, callback) {

        var temp = chunk;
        var chunkLength = chunk.length;
        var buf = Buffer.allocUnsafe(chunkLength);
        var index;

        for (index = 0; index < chunk.length / 2; ++index) {
            buf.writeUInt16BE(chunk.readUInt16BE(index << 1) << 2, index << 1);
        }

        this.push(buf);
        callback();
    }
});
AmplificationTransform.pipe(mySpeaker);

//console.log('generating a %dhz sine wave for %d seconds', freq, duration)






var counter = 0;
// the Readable "_read()" callback function
var time = Date.now();

server.on('message', (msg, rinfo) => {
    // Base64ToAudio.write(msg);
    // console.log(msg.toString('hex'))
    AmplificationTransform.write(msg);
    //Base64ToAudio.write(msg);
    var a = msg.toString();
    if (counter % 100 === 0) {
        console.log(("cointer:\t\t" + counter));
        console.log("+ /Total time taken\t" + (Date.now() - time) + " milliseconds");
        time = Date.now();
    }
    counter++;
});
muLawDecodeTransform.pipe(mySpeaker);

server.on('error', (err) => {
    console.log(`server error:\n${ err.stack }`);
    server.close();
    //mySpeaker.close(flush);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});
server.bind(41234, '192.168.43.179');


//muLaw decoder function
function aw2linear(ulawbyte) {
    //console.log('[ulawbyte]' + ulawbyte);
    const exp_lut = [0, 132, 396, 924, 1980, 4092, 8316, 16764];
    var sign, exponent, mantissa, sample;

    ulawbyte = ~ulawbyte;
    sign = (ulawbyte & 0x80);
    exponent = (ulawbyte >> 4) & 0x07;
    mantissa = ulawbyte & 0x0F;
    sample = exp_lut[exponent] + (mantissa << (exponent + 3));
    if (sign != 0) sample = -sample;

    return (sample);
}