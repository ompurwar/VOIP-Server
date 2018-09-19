'use strict'
var Transform = require('stream')
var dgram = require('dgram')
var UDPclient = dgram.createSocket('udp4')
var fs = require('fs')
var Readable = require('stream').Duplex
var bufferAlloc = require('buffer-alloc')
var Speaker = require('speaker')
var Chalk = require('./chalk.js')
var myChalk = new Chalk()
const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('gotAddress', () => {
  console.log(myChalk.info('gotAddress'));
  console.log(myChalk.info(JSON.stringify(myAddress)));
  initiateCall();
})

myEmitter.on('gotPeer', () => {
  console.log(myChalk.info('gotPeer'));
  console.log(myChalk.info(JSON.stringify(peerAddress)));
  for (let index = 0; index < 100; index++) {
    UDPclient.send(index.toString(), peerAddress.port, peerAddress.ip, (err) => {
      if (err) {
        throw err
      } else {
        console.log(myChalk.info('Data sent'))
      }
    })
  }
})

// creating speaker instance
var mySpeaker = new Speaker({
  channels: 1, // 2 channels
  bitDepth: 16, // 16-bit samples
  sampleRate: 8000, // 44,100 Hz sample rate
  samplesPerFrame: 1024
})

var goMq = false

var goUdp = false

/**
 *
 *
 * @param {*} ip
 * @param {*} port
 */
function address(ip, port) {
  this.ip = ip
  this.port = port
};
var stunServer = new address('192.168.43.179', 41234)
var myAddress = new address(null, null)
var peerAddress = new address(null, null)
var gotPeer = false

// MQTTCLIENT hERE
var mqtt = require('mqtt')
var MQTTclient = mqtt.connect('mqtt://hello-pc:41235')

MQTTclient.on('connect', function () {
  MQTTclient.subscribe('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client2', {
    qos: 1
  }, function (err, grated) {
    if (err) {
      throw err
    } else {
      console.log('[suscribed]\t' + JSON.stringify(grated))
    }
  })
})

MQTTclient.on('message', function (topic, message) {
  goMq = true
  // message is Buffer
  var myMessage = JSON.parse(message)
  if (myMessage.protocol === 'sip' && myMessage.AddressType === 'peer') {
    peerAddress = myMessage.address;
    gotPeer = true;
    myEmitter.emit('gotPeer');
    console.log("[mqonmsg]here is the peer" + peerAddress);
  }
  console.log(message.toString())
})

/* ----------------------------------------------------------------------- */

var muLawDecodeTransform = new Transform({
  transform(chunk, encoding, callback) {
    var chunkLength = chunk.length << 1
    var buf = Buffer.allocUnsafe(chunkLength)
    var index

    for (index = 0; index < chunk.length; ++index) {
      buf.writeInt16BE(aw2linear(chunk[index]), index << 1)
    }

    this.push(buf)
    callback()
  }
})

// amplification transform

const AmplificationTransform = new Transform({

  /**
   *
   *
   * @param {*} chunk
   * @param {*} encoding
   * @param {*} callback
   */
  transform(chunk, encoding, callback) {
    var temp = chunk
    var chunkLength = chunk.length
    var buf = Buffer.allocUnsafe(chunkLength)
    var index

    for (index = 0; index < chunk.length / 2; ++index) {
      buf.writeUInt16BE(chunk.readUInt16BE(index << 1) << 2, index << 1)
    }

    this.push(buf)
    callback()
  }
})
AmplificationTransform.pipe(mySpeaker)

// muLaw decoder function

/**
 *
 *
 * @param {*} ulawbyte
 * @returns returns the decoded sample of 16 bits
 */
function aw2linear(ulawbyte) {
  // console.log('[ulawbyte]' + ulawbyte);
  const expLut = [0, 132, 396, 924, 1980, 4092, 8316, 16764]
  var sign, exponent, mantissa, sample

  ulawbyte = ~ulawbyte
  sign = (ulawbyte & 0x80)
  exponent = (ulawbyte >> 4) & 0x07
  mantissa = ulawbyte & 0x0F
  sample = expLut[exponent] + (mantissa << (exponent + 3))
  if (sign !== 0) {
    sample = -sample
  }

  return (sample)
}

/**
 *  function initiateCall()
 *  function initiate call
 *  basically it send the client Socket Address to peer
 */
function initiateCall() {
  var msg = {
    protocol: 'sip',
    address: myAddress,
    AddressType: 'peer'
  }
  MQTTclient.publish('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', JSON.stringify(msg), {
    qos: 1,
    retain: false
  });
}

muLawDecodeTransform.pipe(mySpeaker)
// calling the stun server to get myown public address [ip, port]
UDPclient.send('hello', stunServer.port, stunServer.ip, (err) => {
  if (err) {
    throw err
  }
  console.log('data sent ')
})

UDPclient.on('message', (msg, rinfo) => {
  console.log(myChalk.info('[udp] got message'))
  goUdp = true
  if (!gotPeer) {
    var myMsg = JSON.parse(msg)
    if (myMsg.protocol === 'stun' && myMsg.AddressType === 'Self') {
      myAddress.ip = myMsg.ip
      myAddress.port = myMsg.port
      myEmitter.emit('gotAddress');
      console.log(`[udp] client got: ${JSON.stringify(myMsg)} from ${rinfo.address}:${rinfo.port}`)

    } else {
      console.log('wrong message format')
    }
  } else {
    console.log('[udp log]\t: ' + msg.toString())
  }
  // AmplificationTransform.write(msg);
})

function sleep(time, callback) {
  var stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {;
  }
  // callback();
}

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(myChalk.lightGreen('What do you think of Node.js? '), (answer) => {
  // TODO: Log the answer in a database
  console.log(myChalk.lightGreen('Thank you for your valuable feedback:') + ` ${myChalk.lightYellow(answer)}`)
  var ans = answer

  if (ans === 'yes' || ans === 'Y' || ans === 'y') {
    var dataSent = true
    initiateCall()


  }
  rl.close()
})