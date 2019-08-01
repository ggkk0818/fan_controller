const EventEmitter = require("events");
const WebSocket = require("ws");
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
    this.pwm.percent = 0.2;
    let fan1 = new Fan();
    fan1.rpmReader = new RPMReader(27);
    fan1.pwm = this.pwm;
    this.fanList.push(fan1);
  }
  getSpeed() {
    return this.pwm ? this.pwm.percent : 0;
  }
  setSpeed(p) {
    if (p >= 0 && p <= 1) {
      p = Math.round(p * 10000) / 10000;
      this.pwm.percent = p;
      this.emit("update_speed", p);
    }
  }
  getFanList() {
    return this.fanList;
  }
  getHostByIp(ip) {
    return _.find(this.hostList, { ip });
  }
  updateHost(req, cmd, data) {
    let host = this.getHostByIp(req.ip);
    if (!host) {
      host = new Host();
      this.hostList.push(host);
    }
    host.name = (data && data.name) || null;
    host.ip = req.ip;
    host.isConnected = req.ws && req.ws.readyState === WebSocket.OPEN;
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
