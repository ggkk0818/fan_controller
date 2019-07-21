import axiosFactory from "@/utils/axiosFactory";
import { AxiosInstance } from "axios";

class FanService {
  private axios: AxiosInstance;
  constructor() {
    this.axios = axiosFactory.getInstance({
      baseURL: "/api"
    });
  }
  setSpeed(percent: number): Promise<any> {
    return this.axios.post("/speed", { speed: percent });
  }
}
module.exports = new FanService();
