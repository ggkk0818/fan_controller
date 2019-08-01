import axiosFactory from "@/utils/axiosFactory";
import { AxiosInstance } from "axios";
import EventEmitter from "eventemitter3";
import Fan from "@/model/Fan";
import Host from "@/model/Host";

export declare class SocketData {
  type: string;
  speed?: number;
  fanList?: Fan[];
  hostList?: Host[];
}
class FanService extends EventEmitter {
  private axios: AxiosInstance;
  private socket!: WebSocket;
  constructor() {
    super();
    this.axios = axiosFactory.getInstance({
      baseURL: "/api"
    });
  }
  setSpeed(percent: number): Promise<any> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve().then(() => {
        this.socket.send(
          JSON.stringify({
            type: "speed",
            speed: percent
          })
        );
      });
    } else {
      return this.axios.post("/speed", { speed: percent });
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
    });
  }
  private onSocketMessage(e: MessageEvent) {
    try {
      const data = <SocketData>JSON.parse(e.data);
      this.emit("update", data);
    } catch (err) {
      console.warn("invalid message", err);
    }
  }
}
export default new FanService();
