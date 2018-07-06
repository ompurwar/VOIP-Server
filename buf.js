const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('ascii'));