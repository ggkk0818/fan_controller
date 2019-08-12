import axiosFactory from "@/utils/axiosFactory";
import { AxiosInstance } from "axios";
import EventEmitter from "eventemitter3";
import Fan from "@/model/Fan";
import Host from "@/model/Host";
const RECONNECT_INTERVAL = 5000;

declare namespace FanServiceTypes {
  type MessageType = "state" | "speed" | "mode";
  type ControlMode = 0 | 1 | 2;
  type SocketData = {
    type: MessageType;
    mode: ControlMode;
    speed?: number;
    fanList?: Fan[];
    hostList?: Host[];
  };
}
class FanService extends EventEmitter {
  private axios: AxiosInstance;
  private socket!: WebSocket;
  private reconnect: boolean = true;
  get autoReconnect() {
    return this.reconnect;
  }
  set autoReconnect(val) {
    this.reconnect = val;
  }
  constructor() {
    super();
    this.axios = axiosFactory.getInstance({
      baseURL: "/api"
    });
  }
  setMode(mode: ControlMode): Promise<any> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve().then(() => {
        this.socket.send(
          JSON.stringify({
            type: "mode",
            mode
          })
        );
      });
    } else {
      return this.axios.post("/mode", { mode });
    }
  }
  setSpeed(percent: number): Promise<any> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve().then(() => {
        this.socket.send(
          JSON.stringify({
            type: "speed",
            percent
          })
        );
      });
    } else {
      return this.axios.post("/speed", { percent });
    }
  }
  connect(): Promise<any> {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(`ws://${location.host}/api/state`);
      this.socket.onmessage = e => this.onSocketMessage(e);
      this.socket.onopen = e => {
        resolve(this.socket);
      };
      this.socket.onerror = e => {
        reject(e);
        this.emit("error", e);
      };
      this.socket.onclose = e => {
        if (this.reconnect) {
          setTimeout(() => {
            this.connect();
          }, RECONNECT_INTERVAL);
        }
      };
    });
  }
  private onSocketMessage(e: MessageEvent) {
    try {
      const data = <FanServiceTypes.SocketData>JSON.parse(e.data);
      this.emit("update", data);
    } catch (err) {
      console.warn("invalid message", err);
    }
  }
}
export default new FanService();
export const MODE_MANUAL: ControlMode = 0;
export const MODE_PERFORMANCE: ControlMode = 1;
export const MODE_SILENCE: ControlMode = 2;
export type MessageType = FanServiceTypes.MessageType;
export type ControlMode = FanServiceTypes.ControlMode;
export type SocketData = FanServiceTypes.SocketData;
