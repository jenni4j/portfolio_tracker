import PortfolioTable from "./components/PortfolioTable";
import type { Stock } from "./types/Stock";

export default function App() {
  const mockStocks: Stock[] = [
    { ticker: "AAPL", name: "Apple", description: "iPhones", shares: 10, value: 2150, returnPct: 6.35, pnl: 128 },
    { ticker: "MSFT", name: "Microsoft", description: "Outlook", shares: 7, value: 1975, returnPct: 3.81, pnl: 72 },
    { ticker: "NVDA", name: "Nvidia", description: "GPUs", shares: 5, value: 2430, returnPct: -4.12, pnl: -105 },
    { ticker: "AMZN", name: "Amazon", description: "everything", shares: 3, value: 552, returnPct: 12.88, pnl: 63 },
  ];

  return (
    <div className="p-4">
      <PortfolioTable stocks={mockStocks} />
    </div>
  );
}
