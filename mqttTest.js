'use strict'
var mqtt = require('mqtt');
var Speaker = require('speaker');
var FileWriter = require('wav').FileWriter;
var Chalk = require('./chalk');
var myChalk = new Chalk();
//var MQTTclient = mqtt.connect('mqtt://206.189.131.144:41235');
var counter = 0;

var outputFileStream = new FileWriter('./test.wav', {
    sampleRate: 8000,
    channels: 1,
    bitDepth: 32
});

// creating speaker instance mqtt://iot.eclipse.org

var MQTTclient = mqtt.connect('mqtt://206.189.131.144:41235');
MQTTclient.on('connect', function () {
    MQTTclient.subscribe('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', {
        qos: 1
    }, function (err, grated) {
        if (err) {
            throw err
        } else {
            console.log('[suscribed]\t' + JSON.stringify(grated))
        }
    });
    MQTTclient.subscribe('/topic/qos0', {
        qos: 0
    }, function (err, grated) {
        if (err) {
            throw err
        } else {
            console.log('[suscribed]\t' + JSON.stringify(grated))
        }
    })
});
MQTTclient.on('message', function (topic, message) {

    // message is Buffer
    //console.log(myChalk.info(message));
    console.log(myChalk.info(message.length));

    outputFileStream.write(message);

});
setInterval(() => {
    MQTTclient.publish('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', JSON.stringify({
        seqNo: counter++,
        msg: `jjjjjjjjajsdhkahskdhkashdkhajkshdjhajksdhkjahdsjhasjkhdjkajksdjkahsjdhjkahsdhajkshfjkhdsajkdfhjashdjkhasjkdhjkahsdjkasjksldfjlsdjflkjsdlkfjkljsklfjdkljkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj`
    }));
}, 500);


// You ask two questions:

// How to downsample from 22kHz to 8kHz?

// How to convert from float [-1,1] to 16-bit int and back?

// Note that the question has been updated to indicate that #1 is taken care of elsewhere, but I'll leave that part of my answer in in case it helps someone else.

// 1. How to downsample from 22kHz to 8kHz?
// A commenter hinted that this can be solved with the FFT. This is incorrect (One step in resampling is filtering. I mention why not to use the FFT for filtering here, in case you are interested: http://blog.bjornroche.com/2012/08/when-to-not-use-fft.html).

// One very good way to resample a signal is with a polyphase filter. However, this is quite complex, even for someone experienced in signal processing. You have several other options:

// use a library that implements high quality resampling, like libsamplerate
// do something quick and dirty
// It sounds like you have already gone with the first approach, which is great.

// A quick and dirty solution won't sound as good, but since you are going down to 8 kHz, I'm guessing sound quality isn't your first priority. One quick and dirty option is to:

// Apply a low pass filter to the signal. Try to get rid of as much audio above 4 kHz as you can. You can use the filters described here (although ideally you want something much steeper than those filters, they are at least better than nothing).
// select every 2.75th sample from the original signal to produce the new, resampled signal. When you need a non-integer sample, use linear interpolation. If you need help with linear interpolation, try here.
// This technique should be more than good enough for voice applications. However, I haven't tried it, so I don't know for sure, so I strongly recommend using someone else's library.

// If you really want to implement your own high quality sample rate conversion, such as a polyphase filter, you should research it, and then ask whatever questions you have on https://dsp.stackexchange.com/, not here.

// 2. How to convert from float [-1,1] to 16-bit int and back?
// This was started by c.fogelklou already, but let me embellish.

// To start with, the range of 16 bit integers is -32768 to 32767 (usually 16-bit audio is signed). To convert from int to float you do this:

// float f;
// int16 i = ...;
// f = ((float) i) / (float) 32768
// if( f > 1 ) f = 1;
// if( f < -1 ) f = -1;
// You usually do not need to do that extra "bounding", (in fact you don't if you really are using a 16-bit integer) but it's there in case you have some >16-bit integers for some reason.

// To convert back, you do this:

// float f = ...;
// int16 i;
// f = f * 32768 ;
// if( f > 32767 ) f = 32767;
// if( f < -32768 ) f = -32768;
// i = (int16) f;
// In this case, it usually is necessary to watch out for out of range values, especially values greater than 32767. You might complain that this introduces some distortion for f = 1. This issue is hotly debated. For some (incomplete) discussion of this, see this blog post.

// This is more than "good enough for government work". In other words, it will work fine except in the case where you are concerned about ultimate sound quality. Since you are going to 8kHz, I think we have established that's not the case, so this answer is fine.

// However, for completeness, I must add this: if you are trying to keep things absolutely pristine, keep in mind that this conversion introduces distortion. Why? Because the error when converting from float to int is correlated with the signal. It turns out that the correlation of that error is terrible and you can actually hear it, even though it's very small. (fortunately it's small enough that for things like speech and low-dynamic range music it doesn't matter much) To eliminate this error, you must use something called dither in the conversion from float to int. Again, if that's something you care about, research it and ask relevant, specific questions on https://dsp.stackexchange.com/, not here.

// You might also be interested in the slides from my talk on the basics of digital audio programming, which has a slide on this topic, although it basically says the same thing (maybe even less than what I just said