const uuidv4 = require("uuid/v4");
const EventEmitter = require("events");
const HostData = require("./HostData");
const AVG_DURATION = 5000;
const MAX_DATA_COUNT = 3600;

class Host extends EventEmitter {
  constructor() {
    super();
    this.id = uuidv4();
    this.name = null;
    this.ip = null;
    this.cmdMap = {};
    this.dataMap = {};
    this.avgData = null;
    this.startTime = null;
    this.endTime = null;
    this.isDirty = false;
  }

  get id() {
    return this.id;
  }

  get name() {
    return this.name ? this.name : "Host" + this.id.substring(0, 4);
  }
  set name(val) {
    this.name = val;
  }

  get ip() {
    return this.ip;
  }
  set ip(val) {
    this.ip = val;
  }

  get cmdList() {
    return Object.keys(this.cmdMap);
  }

  get hostData() {
    return this.endTime ? this.dataMap[this.endTime] : null;
  }

  get avgData() {
    if (this.isDirty) {
      this.avgData = this.calcAvgData();
      this.isDirty = false;
    }
    return this.avgData;
  }

  addCMD(cmd) {
    if (!this.cmdMap.hasOwnProperty(cmd)) {
      this.cmdMap[cmd] = 1;
    } else if (this.cmdMap[cmd] < Number.MAX_VALUE) {
      this.cmdMap[cmd]++;
    }
  }

  addData(data) {
    let time = data.time;
    if (this.endTime === null || time > this.endTime) {
      this.endTime = time;
    }
    if (this.startTime === null || time < this.startTime) {
      this.startTime = time;
    }
    this.dataMap[time] = new HostData(data);
    if (Object.keys(this.dataMap).length > MAX_DATA_COUNT) {
      delete this.dataMap[this.startTime];
      this.startTime = Math.min(Object.keys(this.dataMap));
    }
    this.isDirty = true;
  }

  calcAvgData() {
    let data = null;
    let end = this.endTime;
    let start = end - AVG_DURATION;
    for (let time of Object.keys(this.dataMap)) {
      if (time >= start && time <= end) {
        let item = this.dataMap[time];
        if (data) {
          data.add(item);
        } else {
          data = item.clone();
        }
      }
    }
    return (data && data.avg()) || null;
  }
}
module.exports = Host;
