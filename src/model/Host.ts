declare namespace Host {
  type OFF_LINE = 0;
  type ON_LINE = 1;
  type HostState = OFF_LINE | ON_LINE;
  class HostData {
    time?: number;
    cpuTemp?: number;
    gpuTemp?: number;
    cpuLoad?: number;
    gpuLoad?: number;
    count?: number;
  }
  class Host {
    id: string;
    name: string;
    ip: string;
    cmdList?: string[];
    hostData?: HostData;
    avgData?: HostData;
    state?: HostState;
    isCurrent?: boolean;
  }
}
export default Host.Host;
export type OFF_LINE = Host.OFF_LINE;
export type ON_LINE = Host.ON_LINE;
export type HostState = Host.HostState;
export type HostData = Host.HostData;
