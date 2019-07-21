const rpio = require("rpio");
const MAX_RANGE = 1024;
rpio.init({ gpiomem: false });

class PWM {
  constructor(pin) {
    this.pin = pin;
    this.percent = 0;
    rpio.open(pin, rpio.PWM);
    rpio.pwmSetClockDivider(64);
    rpio.pwmSetRange(pin, MAX_RANGE);
    this.setPercent(0.2);
  }
  getPercent() {
    return this.percent;
  }
  setPercent(p) {
    rpio.pwmSetData(this.pin, MAX_RANGE * p);
    this.percent = p;
    console.log(`pin${this.pin} set pwm ${p * 100}%`);
  }
}
module.exports = PWM;
