const EventEmitter = require("events");
const Gpio = require("pigpio").Gpio;
const TIMER_INTERVAL = 200;
const MAX_DATA_LENGTH = 600 * 5;

class RPM extends EventEmitter {
  constructor(pin) {
    super();
    this.pin = pin;
    this.count = 0;
    this.gpio = null;
    this.timer = null;
    this.rpm = 0;
    this.data = [];
    this.beginRead();
  }
  beginRead() {
    this.gpio = new Gpio(this.pin, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_UP,
      alert: true
    });
    // count pull-up signal
    this.gpio.on("alert", level => {
      if (level) {
        this.count++;
      }
    });
    // calculate rpm every 200ms
    this.timer = setInterval(() => {
      this.data.push(this.count);
      this.count = 0;
      if (this.data.length > MAX_DATA_LENGTH) {
        this.data.splice(0, this.data.length - MAX_DATA_LENGTH);
      }
      this.calcRPM();
    }, TIMER_INTERVAL);
  }
  stopRead() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.gpio) {
      this.gpio.off("alert");
      this.gpio = null;
    }
  }
  calcRPM() {
    let rpm = 0;
    let n = Math.floor(1000 / TIMER_INTERVAL);
    for (let i = 0; i < n; i++) {
      if (this.data.length - 1 - i >= 0) {
        rpm += this.data[this.data.length - 1 - i];
      } else {
        break;
      }
    }
    if (1000 % TIMER_INTERVAL > 0 && this.data.length - 1 - n >= 0) {
      rpm += Math.round(
        this.data[this.data.length - 1 - n] * ((1000 % TIMER_INTERVAL) / 1000)
      );
    }
    rpm *= 30;
    const lastRPM = this.rpm;
    this.rpm = rpm;
    if (rpm !== lastRPM) {
      this.emit("update", rpm);
    }
  }
}
module.exports = RPM;
