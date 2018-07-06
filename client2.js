/*const dgram = require('dgram');
const message = Buffer.from('Some bytes');




const client = dgram.createSocket('udp4');
client.send("lskdjlfkjslekjlwjerijwijeirwsl;ke;kwlerkl;wkerlewkelrkwerlwkerl;kw;lkelkl;rk;wk;lekr;woperowkerk;owkoerwkel;kr;wkel;krl;ewklrl;wekr;lkwerkekrlkw;lkel;wkrl;k", 3478, '23.21.150.121', (err) => {

    console.log("data sent ");

});
var counter = 0;
client.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (counter % 1000 === 0) {
        console.log(("cointer:\t" + counter));
    }
    counter++;
});*/


const net = require('net');
const client = net.createConnection({
    port: 38415,
    host: '192.168.43.197'
}, () => {
    // 'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
});

client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});
client.on('error', (err) => {
    throw err;
})
client.write('world!\r\n');