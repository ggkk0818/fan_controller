const CONTROL_MODE = require("../consts/controlMode");
class AutomaticControl {
  constructor() {
    this._mode = CONTROL_MODE.MANUAL;
    this._pwm = null;
    this._timer = null;
  }
  get mode() {
    return this._mode;
  }
  set mode(val) {
    this._mode = val;
  }
}
module.exports = AutomaticControl;
