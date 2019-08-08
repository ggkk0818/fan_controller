let fanId = 0;

class Fan {
  constructor() {
    this._id = ++fanId;
    this._rpmReader = null;
    this._pwm = null;
  }

  get id() {
    return this._id;
  }

  get name() {
    return `Fan${this._id}`;
  }

  get rpmReader() {
    return this._rpmReader;
  }
  set rpmReader(val) {
    this._rpmReader = val;
  }

  get rpm() {
    return (this._rpmReader && this._rpmReader.rpm) || 0;
  }

  get pwm() {
    return this._pwm;
  }
  set pwm(val) {
    this._pwm = val;
  }

  get load() {
    return (this._pwm && this._pwm.percent) || 0;
  }
}
module.exports = Fan;
