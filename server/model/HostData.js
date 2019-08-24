class HostData {
  constructor(data = {}) {
    this.time = data.time || null;
    this.cpuTemp = data.cpuTemp || null;
    this.gpuTemp = data.gpuTemp || null;
    this.cpuLoad = data.cpuLoad || null;
    this.gpuLoad = data.gpuLoad || null;
    this.count = data.count || 1;
    return this;
  }

  add(data) {
    if (data) {
      let isValid = false;
      if (data.cpuTemp > 0) {
        this.cpuTemp = this.cpuTemp
          ? this.cpuTemp + data.cpuTemp
          : data.cpuTemp;
        isValid = true;
      }
      if (data.gpuTemp > 0) {
        this.gpuTemp = this.gpuTemp
          ? this.gpuTemp + data.gpuTemp
          : data.gpuTemp;
        isValid = true;
      }
      if (data.cpuLoad > 0) {
        this.cpuLoad = this.cpuLoad
          ? this.cpuLoad + data.cpuLoad
          : data.cpuLoad;
        isValid = true;
      }
      if (data.gpuLoad > 0) {
        this.gpuLoad = this.gpuLoad
          ? this.gpuLoad + data.gpuLoad
          : data.gpuLoad;
        isValid = true;
      }
      if (isValid) {
        this.count++;
      }
    }
    return this;
  }

  max(data) {
    if (data) {
      if (data.cpuTemp > 0) {
        this.cpuTemp = Math.max(this.cpuTemp || 0, data.cpuTemp);
      }
      if (data.gpuTemp > 0) {
        this.gpuTemp = Math.max(this.gpuTemp || 0, data.gpuTemp);
      }
      if (data.cpuLoad > 0) {
        this.cpuLoad = Math.max(this.cpuLoad || 0, data.cpuLoad);
      }
      if (data.gpuLoad > 0) {
        this.gpuLoad = Math.max(this.gpuLoad || 0, data.gpuLoad);
      }
    }
    return this;
  }

  min(data) {
    if (data) {
      if (data.cpuTemp > 0) {
        this.cpuTemp = Math.min(this.cpuTemp || 0, data.cpuTemp);
      }
      if (data.gpuTemp > 0) {
        this.gpuTemp = Math.min(this.gpuTemp || 0, data.gpuTemp);
      }
      if (data.cpuLoad > 0) {
        this.cpuLoad = Math.min(this.cpuLoad || 0, data.cpuLoad);
      }
      if (data.gpuLoad > 0) {
        this.gpuLoad = Math.min(this.gpuLoad || 0, data.gpuLoad);
      }
    }
    return this;
  }

  avg() {
    if (this.count > 1) {
      if (this.cpuTemp > 0) {
        this.cpuTemp /= this.count;
      }
      if (this.gpuTemp > 0) {
        this.gpuTemp /= this.count;
      }
      if (this.cpuLoad > 0) {
        this.cpuLoad /= this.count;
      }
      if (this.gpuLoad > 0) {
        this.gpuLoad /= this.count;
      }
      this.count = 1;
    }
    return this;
  }

  clone() {
    return new HostData(this);
  }
}
module.exports = HostData;
