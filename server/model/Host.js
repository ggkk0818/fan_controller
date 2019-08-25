const uuidv4 = require("uuid/v4");
const EventEmitter = require("events");
const HostData = require("./HostData");
const HOST_STATE = require("../consts/hostState");
const AVG_DURATION = 5000;
const MAX_DATA_COUNT = 3600;

class Host extends EventEmitter {
  constructor() {
    super();
    this._id = uuidv4();
    this._name = null;
    this._ip = null;
    this._cmdMap = {};
    this._dataList = [];
    this._avgData = null;
    this._startTime = null;
    this._endTime = null;
    this._lastCommandTime = null;
    this._isConnected = false;
    this._ws = null;
    this._isDirty = false;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name ? this._name : "Host" + this._id.substring(0, 4);
  }
  set name(val) {
    this._name = val;
  }

  get ip() {
    return this._ip;
  }
  set ip(val) {
    this._ip = val;
  }

  get cmdList() {
    return Object.keys(this._cmdMap);
  }

  get hostData() {
    return this._dataList.length
      ? this._dataList[this._dataList.length - 1]
      : null;
  }

  get avgData() {
    if (this._isDirty) {
      this._avgData = this.calcAvgData();
      this._isDirty = false;
    }
    return this._avgData;
  }

  get isConnected() {
    return this._isConnected;
  }
  set isConnected(val) {
    this._isConnected = val;
  }

  get ws() {
    return this._ws;
  }
  set ws(val) {
    this._ws = val;
  }

  get state() {
    return this.isConnected || Date.now() - this._lastCommandTime < 60000
      ? HOST_STATE.ON_LINE
      : HOST_STATE.OFF_LINE;
  }

  addCMD(cmd) {
    if (!this._cmdMap.hasOwnProperty(cmd)) {
      this._cmdMap[cmd] = 1;
    } else if (this._cmdMap[cmd] < Number.MAX_VALUE) {
      this._cmdMap[cmd]++;
    }
    this._lastCommandTime = Date.now();
  }

  addData(data) {
    if (!data) {
      return;
    }
    data.time = data.time || Date.now();
    this._dataList.push(new HostData(data));
    if (this._dataList.length > MAX_DATA_COUNT) {
      this._dataList.splice(0, this._dataList.length - MAX_DATA_COUNT);
    }
    this._isDirty = true;
  }

  calcAvgData() {
    let data = null;
    if (this._dataList.length) {
      let end = this._dataList[this._dataList.length - 1].time;
      let start = end - AVG_DURATION;
      for (let i = this._dataList.length - 1; i >= 0; i--) {
        let item = this._dataList[i];
        if (item.time >= start && item.time <= end) {
          if (data) {
            data.add(item);
          } else {
            data = item.clone();
          }
        } else {
          break;
        }
      }
    }
    return (data && data.avg()) || null;
  }
}
module.exports = Host;
