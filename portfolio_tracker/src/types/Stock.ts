export interface Stock {
    ticker: string;
    name: string;
    description: string;
    lastPrice: number;
    initialPrice: number;
    shares: number;
    value: number;
    returnPct: number;
    pnl: number;
  }