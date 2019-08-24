const EventEmitter = require("events");
const CONTROL_MODE = require("../consts/controlMode");
const HOST_STATE = require("../consts/hostState");
const HostData = require("./HostData");
const MAX_SPEED = 1;
const MIN_SPEED = 0.2;
const MIN_TEMPERATURE = 40;
const MAX_TEMPERATURE = 80;
const SILENCE_MODE_SCALE = 0.6;
const TIMER_INTERVAL = 500;
const MANUAL_HOLD_TIMEOUT = 60000; // change speed in auto mode will hold for 1 minute
class AutomaticControl extends EventEmitter {
  constructor() {
    super();
    this._mode = CONTROL_MODE.MANUAL;
    this._pwm = null;
    this._timer = null;
    this._hostList = null;
    this._fanList = null;
    this._manualExpireTime = null;
  }
  get mode() {
    return this._mode;
  }
  set mode(val) {
    if (val !== this._mode) {
      this._mode = val;
      if (this._mode === CONTROL_MODE.MANUAL) {
        this._clearTimer();
      } else {
        this._setTimer();
      }
      this.emit("update_mode", val);
    }
  }
  set hostList(val) {
    this._hostList = val;
  }
  set fanList(val) {
    this._fanList = val;
  }
  get speed() {
    return this._fanList
      ? this._fanList.map(item => {
          return item.pwm ? item.pwm.percent : 0;
        })
      : [];
  }
  set speed(val = MIN_SPEED) {
    this._setSpeed(val);
    if (this._mode !== CONTROL_MODE.MANUAL) {
      this._manualExpireTime = Date.now() + MANUAL_HOLD_TIMEOUT;
    }
  }
  get avgSpeed() {
    let speed = 0;
    let arr = this.speed;
    if (arr.length) {
      arr.forEach(item => (speed += item));
      speed /= arr.length;
    }
    return speed;
  }

  _setSpeed(val) {
    val = Math.round(val * 10000) / 10000;
    if (this._fanList) {
      let hasChanged = false;
      this._fanList.forEach(item => {
        if (item.pwm && item.pwm.percent !== val) {
          item.pwm.percent = val;
          hasChanged = true;
        }
      });
      if (hasChanged) {
        this.emit("update_speed", val);
      }
    }
  }

  _setTimer() {
    if (!this._timer) {
      this._timer = setInterval(this._calcSpeed.bind(this), TIMER_INTERVAL);
    }
  }

  _clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
      this._manualExpireTime = null;
    }
  }

  _calcSpeed() {
    if (
      this.mode === CONTROL_MODE.MANUAL ||
      (this._manualExpireTime && Date.now() < this._manualExpireTime)
    ) {
      return;
    }
    let speed = MIN_SPEED;
    if (this._hostList && this._hostList.length) {
      let data = new HostData();
      let dataAvg = new HostData();
      this._hostList.forEach(item => {
        if (item.state === HOST_STATE.ON_LINE) {
          data.max(item.hostData);
          dataAvg.max(item.avgData);
        }
      });
      if (this._mode === CONTROL_MODE.PERFORMANCE) {
        data.max(dataAvg);
      } else {
        data.min(dataAvg);
      }
      let p = 0;
      if (data.cpuTemp > 0) {
        p = Math.max(
          p,
          (data.cpuTemp - MIN_TEMPERATURE) / (MAX_TEMPERATURE - MIN_TEMPERATURE)
        );
      }
      if (data.gpuTemp > 0) {
        p = Math.max(
          p,
          (data.gpuTemp - MIN_TEMPERATURE) / (MAX_TEMPERATURE - MIN_TEMPERATURE)
        );
      }
      speed = Math.max(speed, p);
    }
    if (this._mode === CONTROL_MODE.SILENCE) {
      speed *= SILENCE_MODE_SCALE;
    }
    if (speed < MIN_SPEED) {
      speed = MIN_SPEED;
    } else if (speed > MAX_SPEED) {
      speed = MAX_SPEED;
    }
    if (this._manualExpireTime) {
      // back to auto mode when timeout, adjust 10% per second
      let duration = 10000;
      let currentSpeed = Math.max(0, ...this.speed) || 0;
      let step = ((speed - currentSpeed) / (duration / TIMER_INTERVAL)) * 2;
      this._setSpeed(currentSpeed + step);
      if (Date.now() - this._manualExpireTime > duration) {
        this._manualExpireTime = null;
      }
    } else {
      this._setSpeed(speed);
    }
  }
}
module.exports = AutomaticControl;
