const Gpio = require("pigpio").Gpio;
const FREQUENCY = 10000;
const MAX_DUTY = 1000000;

class PWM {
  constructor(pin) {
    this._pin = pin;
    this._percent = 0;
    this._gpio = new Gpio(pin, { mode: Gpio.OUTPUT });
    this._gpio.hardwarePwmWrite(FREQUENCY, 0);
  }
  get percent() {
    return this._percent;
  }
  set percent(p) {
    this._gpio.hardwarePwmWrite(FREQUENCY, Math.floor(MAX_DUTY * p));
    this._percent = p;
    console.log(`pin${this._pin} set pwm ${p * 100}%`);
  }
}
module.exports = PWM;
