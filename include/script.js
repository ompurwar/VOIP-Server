$(document).ready(function () {
  // var mqtt = require('mqtt');
  var connected = false;
  var source = null;
  $("#connectionSt").addClass("offline");
  $("#main").hide();
  console.log("from script.js");
  window.addEventListener("bufferFull", () => {
    console.log("buffer full");

  });
  var buffull = new CustomEvent("bufferFull");
  // Create a client instance
  var client = mqtt.connect('wss://206.189.131.144:2000');
  // var client = mqtt.connect('mqtt://localhost:1800')
  function createProfile() {
    window.localStorage.setItem()
  };

  ////////////////////// canvas draw
  var canvas = document.getElementById("myCanvas");
  var canvasCtx = canvas.getContext("2d");

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw(data) {
    drawVisual = requestAnimationFrame(draw);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);


    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / data.length;
    // console.log("sliceWidth:\t: " + canvas.height);
    var x = 0;
    for (var i = 0; i < data.length; i++) {

      var v = data[i] * 100;
      //console.log(array_time_domain[i]);
      var y = v + HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    //console.log(array_time_domain[1]);
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  };
  /////////////////////////////////
  client.on('connect', function () {
    console.log("connected");
    $("#connectionSt").removeClass("offline").addClass("online");
    client.subscribe('/new/user/', function (err) {
      if (!err) {
        console.log("subscribed");
      }
    })
    // client.subscribe('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client1', function (err) {
    //   if (!err) {
    //     console.log("subscribed");
    //   }
    // })
    client.subscribe('jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client2', function (err) {
      if (!err) {
        console.log("subscribed\t: jkhaiwue8r23u923y9r9wuf89y93wyr89aur/client2");
      }
    })
  });
  client.on("offline", function () {
    $("#connectionSt").removeClass("online").addClass("offline");

  });
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  const bufferSize = 10240 * 10;
  var tempbuffer = [];
  var audioCtx = new AudioContext({
    latencyHint: 'interactive',
    sampleRate: 44100
  });
  // var audioCtx = new AudioContext({
  //   latencyHint: 'interactive',
  //   sampleRate: 44100,
  // });
  var myArrayBuffer = audioCtx.createBuffer(2, bufferSize, 44100);
  var buffoffset = 0;
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var resume = false;

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.length);
    // console.log(JSON.parse(message));

    //console.log(message);
    // console.log(message.offset);
    var uintbuf = new Uint8Array(message).buffer
    var float32array = new Float32Array(uintbuf, 0, message.length / 4);
    //console.log(float32array)
    draw(float32array);
    for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      nowBuffering = myArrayBuffer.getChannelData(channel);

      if (buffoffset >= bufferSize) {
        window.dispatchEvent(buffull);
        // Get an AudioBufferSourceNode.
        // This is the AudioNode to use when we want to play an AudioBuffer
        source = audioCtx.createBufferSource();
        // set the buffer in the AudioBufferSourceNode
        tempbuffer.forEach((el, index) => {

          nowBuffering[index] = el;
        });
        source.buffer = myArrayBuffer;
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        source.connect(audioCtx.destination);

        // start the source playing
        source.start();
        // buffoffset = 0;
        buffoffset = 0;

      }
      // filling the buffer with PCM data at channel nunber "value of channel"
      // filling the buffer with PCM data at channel nunber "value of channel"
      float32array.forEach((el, index) => {
        tempbuffer[index + buffoffset] = el;
      });
      ///console.log(nowBuffering.valueOf());

    }
    // incrementing the offset
    buffoffset += 1024;



    // var uint8buffer = new Uint8Array(message).buffer;
    // var uint32array = new Int32Array(uint8buffer);
    // var float32array = Float32Array.from(uint32array, X => X / 2147483648);

    // // Fill the buffer with white noise;
    // // just random values between -1.0 and 1.0
    // for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    //   // This gives us the actual array that contains the data
    //   var nowBuffering = myArrayBuffer.getChannelData(channel);



    //   // filling the buffer with PCM data at channel nunber "value of channel"
    //   float32array.forEach((el, index) => {
    //     tempbuffer[index + buffoffset] = el;
    //   });
    //   if (buffoffset >= bufferSize) {
    //     window.dispatchEvent(buffull);
    //     // Get an AudioBufferSourceNode.
    //     // This is the AudioNode to use when we want to play an AudioBuffer
    //     source = audioCtx.createBufferSource();
    //     // set the buffer in the AudioBufferSourceNode
    //     tempbuffer.forEach((el, index) => {

    //       nowBuffering[index] = el;
    //     });
    //     source.buffer = myArrayBuffer;
    //     // connect the AudioBufferSourceNode to the
    //     // destination so we can hear the sound
    //     source.connect(audioCtx.destination);

    //     // start the source playing
    //     source.start();
    //     // buffoffset = 0;
    //     buffoffset = 0;
    //   }
    //   if (!resume) {

    //     resume = true;

    //   }
    //   ///console.log(nowBuffering.valueOf());

    // }
    // // incrementing the offset
    // buffoffset += 1024;
  })


});