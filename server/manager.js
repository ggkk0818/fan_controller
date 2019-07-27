const EventEmitter = require("events");
const PWM = require("./PWM");
const RPM = require("./RPM");

/**
 * control pwm signal and get fan rpm data
 */
class Manager extends EventEmitter {
  constructor() {
    super();
    this.pwm = new PWM(18);
    this.rpmList = [new RPM(27)];
    this.hostList = [];
  }
  getSpeed() {
    return this.pwm ? this.pwm.getPercent() : 0;
  }
  setSpeed(p) {
    this.pwm.setPercent(p);
    this.emit("update_speed", p);
  }
  getRpm() {
    return this.rpmList.map(item => item.rpm);
  }
  setState(state) {
    this.emit("update_state", state);
  }
}

module.exports = new Manager();
