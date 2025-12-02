import { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import type { Stock } from "../types/Stock";

export default function Portfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const tickers = ["AAPL", "MSFT", "NVDA", "AMZN"].join(",");
      const res = await fetch(`http://localhost:5001/api/quotes?tickers=${tickers}`);
      const data = await res.json();
      setStocks(data);
    };
    fetchStocks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <PortfolioTable stocks={stocks} />
    </div>
  );
}
