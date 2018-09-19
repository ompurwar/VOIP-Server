for (var i = 0; i < 255; ++i) {
    console.log("\x1b[" + i + "mhello" + "\x1b[0m" + " " + i)
}