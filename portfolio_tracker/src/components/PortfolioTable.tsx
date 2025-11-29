import type { Stock } from "../types/Stock";

interface PortfolioTableProps {
  stocks: Stock[];
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 tracking-wide">PORTFOLIO</h1>

      <table className="w-full text-sm border-collapse shadow-lg">
        <thead className="bg-[#e9ecf1] text-left uppercase text-xs tracking-wider font-bold">
          <tr>
            <th className="p-3">Ticker</th>
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
              <td className="p-3">{s.shares}</td>
              <td className="p-3">${s.value.toLocaleString()}</td>
              <td className={`p-3 font-bold ${s.returnPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                {s.returnPct.toFixed(2)}%
              </td>
              <td className={`p-3 font-bold ${s.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${s.pnl.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
