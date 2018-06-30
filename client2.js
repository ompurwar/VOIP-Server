const dgram = require('dgram');
const message = Buffer.from('Some bytes');




const client = dgram.createSocket('udp4');
client.send("lskdjlfkjslekjlwjerijwijeirwsl;ke;kwlerkl;wkerlewkelrkwerlwkerl;kw;lkelkl;rk;wk;lekr;woperowkerk;owkoerwkel;kr;wkel;krl;ewklrl;wekr;lkwerkekrlkw;lkel;wkrl;k", 41234, '192.168.43.179', (err) => {

    console.log("data sent ");

});
var counter = 0;
client.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (counter % 1000 === 0) {
        console.log(("cointer:\t" + counter));
    }
    counter++;
});