'use strict';

module.exports = class Chalk {
    constructor() {
        this.waringCount = 0
        this.errorCount = 0
        this.infoCount = 0
        this._die = {
            Reset: "\x1b[0m",
            Bright: "\x1b[1m",
            Dim: "\x1b[2m",
            Underscore: "\x1b[4m",
            Blink: "\x1b[5m",
            Reverse: "\x1b[7m",
            Hidden: "\x1b[8m",

            FgBlack: "\x1b[30m",
            FgRed: "\x1b[31m",
            FgGreen: "\x1b[32m",
            FgYellow: "\x1b[33m",
            FgBlue: "\x1b[34m",
            FgMagenta: "\x1b[35m",
            FgCyan: "\x1b[36m",
            FgWhite: "\x1b[37m",

            FgLightBlack: "\x1b[90m",
            FgLightRed: "\x1b[91m",
            FgLightGreen: "\x1b[92m",
            FgLightYellow: "\x1b[93m",
            FgLightBlue: "\x1b[94m",
            FgLightMagenta: "\x1b[95m",
            FgLightCyan: "\x1b[96m",
            FgLightWhite: "\x1b[97m",

            BgBlack: "\x1b[40m",
            BgRed: "\x1b[41m",
            BgGreen: "\x1b[42m",
            BgYellow: "\x1b[43m",
            BgBlue: "\x1b[44m",
            BgMagenta: "\x1b[45m",
            BgCyan: "\x1b[46m",
            BgWhite: "\x1b[47m",


            BgLightBlack: "\x1b[100m",
            BgLightRed: "\x1b[101m",
            BgLightGreen: "\x1b[102m",
            BgLightYellow: "\x1b[103m",
            BgLightBlue: "\x1b[104m",
            BgLightMagenta: "\x1b[105m",
            BgLightCyan: "\x1b[106m",
            BgLightWhite: "\x1b[107m",
        }
    }
    red(string) {
        return this._die.FgRed + string + this._die.Reset;
    }
    lightRed(string) {
        return this._die.FgLightRed + string + this._die.Reset;
    }
    green(string) {
        return this._die.FgGreen + string + this._die.Reset;
    }
    lightGreen(string) {
        return this._die.FgLightGreen + string + this._die.Reset;
    }
    blue(string) {
        return this._die.FgBlue + string + this._die.Reset;
    }
    lightBlue(string) {
        return this._die.FgLightBlue + string + this._die.Reset;
    }

    yellow(string) {
        return this._die.FgYellow + string + this._die.Reset;
    }
    lightYellow(string) {
        return this._die.FgLightYellow + string + this._die.Reset;
    }
    cyan(string) {
        return this._die.FgCyan + string + this._die.Reset;
    }
    lightCyan(string) {
        return this._die.FgLightCyan + string + this._die.Reset;
    }
    magenta(string) {
        return this._die.FgMagenta + string + this._die.Reset;
    }
    lightMagenta(string) {
        return this._die.FgLightMagenta + string + this._die.Reset;
    }
    white(string) {
        return string;
    }
    warn(string) {
        this.waringCount++;
        return '(' + this.lightYellow('Warning') + ') [' + this.green(this.waringCount) + ']  '+this.lightBlue(Date()) + this._die.Reset + "\t: " + this.lightYellow(string);

    }
    error(string) {
        this.errorCount++;
        return '(' + this.lightRed('Error') + ') [' + this.yellow(this.errorCount) + ']  ' +this.lightBlue(Date()) + this._die.Reset + "\t: "+ this.lightRed(string);

    }
    info(string) {
        this.infoCount++;
        return '(' + this.lightGreen('Info') + ') [' + this.yellow(this.infoCount) + ']  '+this.lightBlue(Date()) + this._die.Reset + "\t: " + this.green(string);

    }
    invertBg(string) {
        return this._die.Reverse + string + this._die.Reset;
    }
    blink(string) {
        return this._die.Blink + string + this._die.Reset;
    }
    dim(string) {
        return this._die.Dim + string + this._die.Reset;
    }
    underscore(string) {
        return this._die.Underscore + string + this._die.Reset;
    }
    bright(string) {
        return this._die.Bright + string + this._die.Reset;
    }
}