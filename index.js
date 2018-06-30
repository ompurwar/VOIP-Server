const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var counter = 0;
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});


server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (counter % 1000 === 0) {
        console.log(("cointer:\t" + counter));
    }
    server.send("bye", rinfo.port, rinfo.address, (err) => {

        console.log("data sent ");

    });
    counter++;
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


server.bind(41234, '192.168.43.179');
// server listening 0.0.0.0:41234