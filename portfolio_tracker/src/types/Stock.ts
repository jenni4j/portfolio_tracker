export interface Stock {
    ticker: string;
    name: string;
    description: string;
    shares: number;
    value: number;
    returnPct: number;
    pnl: number;
    priceWhenAdded: number;
    lastPrice: number;
  }