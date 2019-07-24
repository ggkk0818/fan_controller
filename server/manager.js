const PWM = require("./PWM");

/**
 * control pwm signal and get fan rpm data
 */
class Manager {
  constructor() {
    this.pwm = new PWM(12);
  }
  getSpeed() {
    return this.pwm ? this.pwm.getPercent() : 0;
  }
  setSpeed(p) {
    this.pwm.setPercent(p);
  }
}

module.exports = new Manager();
