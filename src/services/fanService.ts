import axiosFactory from "@/utils/axiosFactory";
import { AxiosInstance } from "axios";
import EventEmitter from "eventemitter3";
import Fan from "@/model/Fan";
export declare class SocketData {
  type: string;
  speed?: number;
  fanList?: Fan[];
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
  connect() {
    this.socket = new WebSocket(`ws://${location.host}/api/state`);
    this.socket.onmessage = e => this.onSocketMessage(e);
    this.socket.onopen = e => {
      this.socket.send("hello");
    };
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
