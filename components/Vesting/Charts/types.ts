export interface IChartValues {
  tokenSymbol: string;
  amount: number;
  vestingPeriod: number;
  cliffPeriod: number | null;
  startTime: Date;
  vestedDays?: string | null | undefined;
}
