import { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { Stock } from "../types/Stock";
import { supabase } from "../lib/supabaseClient";
import EditStockModal from "./EditStockModal";

interface PortfolioTableProps {
  portfolio: {
    id: number;
    name: string;
    stocks?: Stock[];
  };
  refresh: () => void;
}

export default function PortfolioTable({ portfolio, refresh }: PortfolioTableProps) {
  const [openName, setOpenName] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const stocks = portfolio.stocks || [];
  const [sortDesc, setSortDesc] = useState(true);

  const sortedStocks = [...stocks].sort((a, b) =>
    sortDesc ? b.returnPct - a.returnPct : a.returnPct - b.returnPct
  ); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenName(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const deleteStock = async (id: number) => {
    if (!confirm("Delete this stock?")) return;

    await supabase.from("stocks").delete().eq("id", id);
    refresh();
  };

  const addStock = async () => {
    const ticker = prompt("Ticker? If Canadian stock, add .TO after ticker");
    const shares = Number(prompt("Shares?"));
    const initialPrice = Number(prompt("Initial price?"));

    if (!ticker || !shares || !initialPrice) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from("stocks").insert([
      {
        user_id: userData.user.id,
        portfolio_id: portfolio.id,
        ticker,
        shares,
        initial_price: initialPrice,
      },
    ]);

    refresh();
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 tracking-wide">{portfolio.name}</h2>

      <table className="w-full table-fixed text-sm border-collapse shadow-lg">
        <thead className="bg-[#e9ecf1] text-left uppercase text-xs tracking-wider font-bold">
          <tr>
            <th className="p-3 w-1/8">Ticker</th>
            <th className="p-3 w-1/8">Company</th>
            <th className="p-3 w-1/8 text-center">Last Price</th>
            <th className="p-3 w-1/8 text-center">Initial Price</th>
            <th className="p-3 w-1/8 text-center">Shares</th>
            <th className="p-3 w-1/8 text-center">Value</th>
            <th className="p-3 w-1/8 text-center cursor-pointer" onClick={() => setSortDesc(!sortDesc)}>
              <div className="flex items-center justify-center gap-1">
                Return %
                {sortDesc ? (<ChevronDown className="w-4 h-4" />) : (<ChevronUp className="w-4 h-4" />)}
              </div>
            </th>
            <th className="p-3 w-1/8 text-center">P/L</th>
            <th className="p-3 w-[60px] text-center"></th>
          </tr>
        </thead>

        <tbody>
          {sortedStocks.map((s, i) => (
            <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-[#eef4ff]"}>
              <td className="p-3 font-semibold">{s.ticker}</td>

              <td className="p-3 relative">
                <span
                  className="underline cursor-pointer"
                  onClick={() => setOpenName(openName === s.name ? null : s.name)}
                >
                  {s.name}
                </span>

                {openName === s.name && (
                  <div className="absolute left-0 top-full mt-1 w-64 p-3 text-sm bg-white rounded shadow-lg z-10 border border-gray-300">
                    {s.description}
                  </div>
                )}
              </td>

              <td className="p-3 text-center">{s.lastPrice}</td>
              <td className="p-3 text-center">{s.initialPrice}</td>
              <td className="p-3 text-center">{s.shares}</td>
              <td className="p-3 text-center">${s.value.toLocaleString()}</td>

              <td
                className={`p-3 text-center font-bold ${
                  s.returnPct >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {s.returnPct.toFixed(2)}%
              </td>

              <td
                className={`p-3 text-center font-bold ${
                  s.pnl >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${s.pnl.toLocaleString()}
              </td>

              <td className="p-3 text-center">
                <div className="flex justify-center gap-3">
                  <button onClick={() => setEditingStock(s)} className="hover:scale-110 cursor-pointer">
                    <Pencil className="w-5 h-4" />
                  </button>

                  <button onClick={() => deleteStock(s.id)} className="hover:scale-110 cursor-pointer">
                    <Trash2 className="w-5 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full flex justify-center mt-3">
        <button
          onClick={addStock}
          className="px-1 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white shadow-sm hover:bg-[#eef4ff] cursor-pointer"
        >
          + Add Entry
        </button>
      </div>

      {editingStock && (
        <EditStockModal
          stock={editingStock}
          onClose={() => setEditingStock(null)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
