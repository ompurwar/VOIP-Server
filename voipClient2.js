'use strict';
var Transform = require('stream');
var dgram = require('dgram');
var UDPclient = dgram.createSocket('udp4');
var fs = require('fs');
var Readable = require('stream').Duplex;
var bufferAlloc = require('buffer-alloc');
var Speaker = require('speaker');
var Chalk = require('./chalk.js')
var myChalk = new Chalk()
//creating speaker instance
var mySpeaker = new Speaker({
    channels: 1, // 2 channels
    bitDepth: 16, // 16-bit samples
    sampleRate: 8000, // 44,100 Hz sample rate
    samplesPerFrame: 1024
})
var sentPacketCounter = 0;

function address(ip, port) {
    this.ip = ip;
    this.port = port;
};

var stunServer = new address('192.168.43.179', 41234)
var myAddress = new address(null, null)
var peerAddress = new address(null, null)
var gotPeer = false


//MQTTCLIENT hERE
var mqtt = require('mqtt');
var MQTTclient = mqtt.connect('mqtt://hello-pc:41235')

MQTTclient.on('connect', function () {
    MQTTclient.subscribe('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', {
        qos: 1
    }, function (err, grated) {
        if (err) {
            throw err;
        } else {
            console.log("[subscribed]\t" + JSON.stringify(grated));
        }
    });
});

/**
 *  function initiateCall()
 *  function initiate call     
 *  basically it send the client Socket Address to peer
 */
function initiateCall() {
    var msg = {
        protocol: 'stun',
        address: myAddress,
        AddressType: 'peer'
    };
    MQTTclient.publish('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', JSON.stringify(msg), {
        qos: 1,
        retain: false
    });
}

MQTTclient.on('message', function (topic, message) {
    // message is Buffer
    console.log(myChalk.warn(message.toString()));
    console.log(myChalk.red("[peersent]") + JSON.stringify(myAddress))
    var myMessage = JSON.parse(message.toString());
    console.log(myChalk.info(JSON.stringify(myMessage)));
    if (myMessage.protocol === 'sip' && myMessage.AddressType === 'peer') {
        peerAddress = myMessage.address;
        gotPeer = true;
        console.log(myChalk.red("[got peer]") + JSON.stringify(peerAddress))

        var msg = {
            protocol: 'sip',
            address: myAddress,
            AddressType: 'peer'
        };
        MQTTclient.publish('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client2', JSON.stringify(msg), {
            qos: 1,
            retain: false
        }, () => {

            /*for (let index = 0; index < 100; index++) {
             */
            setInterval(() => {
                UDPclient.send(sentPacketCounter.toString(), peerAddress.port, peerAddress.ip, (err) => {
                    if (err) {
                        throw err
                    } else {
                        console.log(myChalk.info('Data sent'))
                            ++sentPacketCounter;
                    }
                })
            }, 25)
            /*
                }*/

        });
    };
    console.log(myChalk.info(message.toString()))

});

/*-----------------------------------------------------------------------*/


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



//muLawDecodeTransform.pipe(mySpeaker);

UDPclient.send("hello", stunServer.port, stunServer.ip, (err) => {

    if (err) throw err;
    else
        console.log("data sent ");

});

UDPclient.on('message', (msg, rinfo) => {
    console.log(!gotPeer);
    if (!gotPeer) {
        var myMsg = JSON.parse(msg);
        if (myMsg.protocol === 'stun' ) {
            myAddress = new address(myMsg.ip, myMsg.port);
            console.log(`client got: ${JSON.stringify(myMsg)} from ${rinfo.address}:${rinfo.port}`);


        } else {
            console.log("wrong message format");
        }
    } else {
        AmplificationTransform.write(msg)

    }
});

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question(myChalk.lightGreen('What do you terminate call '), (answer) => {
    // TODO: Log the answer in a database
    console.log(myChalk.lightGreen('Thank you for your valuable feedback:') + ` ${myChalk.lightYellow(answer)}`)
    var ans = answer

    if (ans === 'yes' || ans === 'Y' || ans === 'y') {
        var dataSent = true
        var msg = {
            protocol: 'sip',
            message: 'x',
        };
        MQTTclient.publish('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client2', JSON.stringify(msg), {
            qos: 1,
            retain: false
        });
    }
    rl.close()
})