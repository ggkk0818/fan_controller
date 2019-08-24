export function getTimeScale(rpm: number): number {
  return (rpm / 2000) * 3;
}
