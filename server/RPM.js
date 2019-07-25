// const rpio = require("rpio");
const Gpio = require("pigpio").Gpio;
// rpio.init({ gpiomem: false });

class RPM {
  constructor(pin) {
    this.pin = pin;
    this.count = 0;
    this.lastVal = 0;
    // rpio.open(pin, rpio.INPUT, rpio.PULL_UP);
    setInterval(() => {
      console.log("count", this.count);
      this.count = 0;
    }, 1000);
    this.beginRead2();
  }
  beginRead() {
    return new Promise(resolve => {
      let start = new Date().getTime();
      while (new Date().getTime() - start < 100) {
        let val = rpio.read(this.pin);
        if (rpio.read(this.pin) !== this.lastVal) {
          this.lastVal = rpio.read(this.pin);
        }
        if (this.lastVal) {
          this.count++;
        }
      }
      process.nextTick(() => {
        resolve();
      });
    }).then(() => {
      return this.beginRead();
    });
  }
  beginRead2() {
    let gpio = new Gpio(27, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      alert: true
    });
    gpio.on("alert", level => {
      if (level) {
        this.count++;
      }
    });
  }
}
module.exports = RPM;
