import HostData from "./HostData";

declare class Host {
  id: string;
  name: string;
  ip: string;
  cmdList?: string[];
  hostList?: HostData[];
}
export default Host;