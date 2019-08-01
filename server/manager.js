const EventEmitter = require("events");
const _ = require("lodash");
const PWM = require("./model/PWM");
const RPMReader = require("./model/RPMReader");
const Fan = require("./model/Fan");
const Host = require("./model/Host");

/**
 * control pwm signal and get fan rpm data
 */
class Manager extends EventEmitter {
  constructor() {
    super();
    this.pwm = null;
    this.fanList = [];
    this.hostList = [];
    this._init();
  }
  _init() {
    this.pwm = new PWM(18);
    let fan1 = new Fan();
    fan1.rpmReader = new RPMReader(27);
    fan1.pwm = this.pwm;
    this.fanList.push(fan1);
  }
  getSpeed() {
    return this.pwm ? this.pwm.percent : 0;
  }
  setSpeed(p) {
    this.pwm.percent = p;
    this.emit("update_speed", p);
  }
  getFanList() {
    return this.fanList;
  }
  getHostByIp(ip) {
    return _.find(this.hostList, { ip: _.trim(ip) });
  }
  updateHost(req, cmd, data) {
    let host = this.getHostByIp(req.ip);
    if (!host) {
      host = new Host();
    }
    host.name = req.hostname;
    host.ip = req.ip;
    if (cmd) {
      host.addCMD(cmd);
    }
    if (data) {
      host.addData(data);
    }
    this.emit("update_host", host);
    return host;
  }
}

module.exports = new Manager();
