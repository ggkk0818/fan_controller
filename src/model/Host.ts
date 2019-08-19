export const OFF_LINE = 0;
export const ON_LINE = 1;
export type HostState = 0 | 1;
export interface HostData {
  time?: number;
  cpuTemp?: number;
  gpuTemp?: number;
  cpuLoad?: number;
  gpuLoad?: number;
  count?: number;
}
export interface Host {
  id: string;
  name: string;
  ip: string;
  cmdList?: string[];
  hostData?: HostData;
  avgData?: HostData;
  state?: HostState;
  isCurrent?: boolean;
}
export default Host;
