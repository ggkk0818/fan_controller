const Gpio = require("pigpio").Gpio;
const FREQUENCY = 10000;
const MAX_DUTY = 1000000;

class PWM {
  constructor(pin) {
    this.pin = pin;
    this.percent = 0;
    this.gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
    this.gpio.hardwarePwmWrite(FREQUENCY, 0);
    this.setPercent(0.2);
  }
  get percent() {
    return this.percent;
  }
  set percent(p) {
    this.gpio.hardwarePwmWrite(FREQUENCY, Math.floor(MAX_DUTY * p));
    this.percent = p;
    console.log(`pin${this.pin} set pwm ${p * 100}%`);
  }
}
module.exports = PWM;
