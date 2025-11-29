import { useState, useEffect} from "react";
import type { Stock } from "../types/Stock";

interface PortfolioTableProps {
  stocks: Stock[];
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  const [openName, setOpenName] = useState<string | null>(null);
  const [openPnl, setOpenPnl] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenName(null);
        setOpenPnl(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 tracking-wide">PORTFOLIO</h1>

      <table className="w-full text-sm border-collapse shadow-lg">
        <thead className="bg-[#e9ecf1] text-left uppercase text-xs tracking-wider font-bold">
          <tr>
            <th className="p-3">Ticker</th>
            <th className="p-3">Company</th>
            <th className="p-3">Shares</th>
            <th className="p-3">Value</th>
            <th className="p-3">Return %</th>
            <th className="p-3">P/L</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={s.ticker} className={`${i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"}`}>
              <td className="p-3 font-semibold">{s.ticker}</td>
              {/* Added company description under the company name as a click tooltip */}
              <td className="p-3 relative">
                <span
                  className="underline cursor-pointer"
                  onClick={() =>
                    setOpenName(openName === s.name ? null : s.name)
                  }
                >
                  {s.name}
                </span>

                {openName === s.name && (
                  <div className="absolute left-0 top-full mt-1 w-64 max-w-[20rem] p-3 text-sm text-black bg-white rounded shadow-lg z-10 break-words border border-gray-300">
                    {s.description}
                  </div>
                )}
              </td>
              <td className="p-3">{s.shares}</td>
              <td className="p-3">${s.value.toLocaleString()}</td>
              <td className={`p-3 font-bold ${s.returnPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                {s.returnPct.toFixed(2)}%
              </td>
              <td className={`p-3 font-bold relative ${s.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                <span
                    className="underline cursor-pointer"
                    onClick={() =>
                      setOpenPnl(openPnl === s.pnl? null : s.pnl)
                    }
                  >
                    ${s.pnl.toLocaleString()}
                  </span>
                  {openPnl === s.pnl && (
                    <div className="absolute left-0 top-full mt-1 w-64 max-w-[20rem] p-3 text-sm text-black bg-white rounded shadow-lg z-10 break-words border border-gray-300">
                      <div><strong>Price when added:</strong> ${s.priceWhenAdded.toLocaleString()}</div>
                    </div>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
