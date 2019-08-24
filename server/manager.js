const EventEmitter = require("events");
const WebSocket = require("ws");
const _ = require("lodash");
const PWM = require("./model/PWM");
const RPMReader = require("./model/RPMReader");
const Fan = require("./model/Fan");
const Host = require("./model/Host");
const AutomaticControl = require("./model/AutomaticControl");
const CONTROL_MODE = require("./consts/controlMode");

/**
 * control pwm signal and get fan rpm data
 */
class Manager extends EventEmitter {
  constructor() {
    super();
    this.pwm = null;
    this.fanList = [];
    this.hostList = [];
    this.controller = null;
    this._init();
  }
  _init() {
    this.pwm = new PWM(18);
    let fan1 = new Fan();
    fan1.rpmReader = new RPMReader(23);
    fan1.pwm = this.pwm;
    let fan2 = new Fan();
    fan2.rpmReader = new RPMReader(22);
    fan2.pwm = this.pwm;
    this.fanList.push(fan1, fan2);
    this.controller = new AutomaticControl();
    this.controller.fanList = this.fanList;
    this.controller.hostList = this.hostList;
    this.controller.on("update_speed", val => {
      this.emit("update_speed", val);
    });
    this.controller.on("update_mode", val => {
      this.emit("update_mode", val);
    });
    this.controller.mode = CONTROL_MODE.PERFORMANCE;
  }
  getMode() {
    return this.controller ? this.controller.mode : null;
  }
  setMode(val) {
    if (this.controller && Object.values(CONTROL_MODE).includes(val)) {
      this.controller.mode = val;
    }
  }
  getSpeed() {
    return this.controller ? this.controller.avgSpeed : 0;
  }
  setSpeed(p) {
    if (p >= 0 && p <= 1) {
      this.controller.speed = p;
    }
  }
  getFanList() {
    return this.fanList;
  }
  getHostByIp(ip) {
    return _.find(this.hostList, { ip });
  }
  getHostByWs(ws) {
    return _.find(this.hostList, { ws });
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
    if (
      req.ws &&
      (req.ws.readyState === WebSocket.CONNECTING ||
        req.ws.readyState === WebSocket.OPEN)
    ) {
      host.ws = req.ws;
    } else {
      host.ws = null;
    }
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
