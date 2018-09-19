const EventEmitter = require('events')

const Chalk = require('./chalk');

const myChalk = new Chalk();
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.emit('hello');
myEmitter.on('hello', () => {
    console.log(myChalk.info("hello"));
})

myEmitter.on('hello', () => {
    for (let index = 0; index < 100; ++index) {
        console.log(myChalk.error("hi"));
    }
})





process.nextTick(() => {
    for (let index = 0; index < 100; ++index) {
        myEmitter.emit('hello')
    }
});
process.nextTick(() => {
    for (let index = 0; index < 100; ++index) {
        myEmitter.emit('hi')
    }
});