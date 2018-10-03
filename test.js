// 'use strict'
// var dgram = require('dgram')

// var UDPclient = dgram.createSocket('udp4');
// var Chalk = require('./chalk.js');
// var myChalk = new Chalk()



// UDPclient.on('message', (msg, rinfo) => {
//     console.log(myChalk.info('[udp] got message'))

//         console.log(`[udp] client got: ${msg} from ${rinfo.address}:${rinfo.port}`)

//     // AmplificationTransform.write(msg);
// })

// UDPclient.send('hello', 3000, '206.189.131.144', (err) => {
//     if (err) {
//       throw err
//     }
//     console.log('data sent ')
//   })
//  // UDPclient.bind(803453,'192.168.1.19')

var a = [23, 4, 34, 545, 654, 4, 0.23402034224, .2, 4, 234, 2, .43, .24, 2., 3];

var b = Float32Array.from(a, x => x /2147483648);
console.error(b);