let fanId = 0;

class Fan {
  constructor() {
    this.id = ++fanId;
    this.rpmReader = null;
    this.pwm = null;
  }

  get id() {
    return this.id;
  }

  get name() {
    return `Fan${this.id}`;
  }

  get rpmReader() {
    return this.rpmReader;
  }
  set rpmReader(val) {
    this.rpmReader = val;
  }

  get rpm() {
    return (this.rpmReader && this.rpmReader.rpm) || 0;
  }

  get pwm() {
    return this.pwm;
  }
  set pwm(val) {
    this.pwm = val;
  }
}
module.exports = Fan;
