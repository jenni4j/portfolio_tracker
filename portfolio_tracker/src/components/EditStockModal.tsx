import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Stock } from "../types/Stock";

interface EditStockModalProps {
  stock: Stock;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditStockModal({ stock, onClose, onSaved }: EditStockModalProps) {
  const [shares, setShares] = useState(String(stock.shares));
  const [initialPrice, setInitialPrice] = useState(String(stock.initialPrice));

  const save = async () => {
    await supabase
      .from("stocks")
      .update({ 
        shares: Number(shares) || 0, 
        initial_price: Number(initialPrice) || 0 
      })
      .eq("id", stock.id);

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="font-bold text-lg mb-4">Edit {stock.ticker}</h2>

        <label className="block text-sm mb-2">
          Shares
          <input
            type="number"
            className="border w-full p-1 mt-1"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
        </label>

        <label className="block text-sm mb-4">
          Initial Price
          <input
            type="number"
            className="border w-full p-1 mt-1"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-3">
          <button className="px-3 py-1 border cursor-pointer" onClick={onClose}>
            Cancel
          </button>
          <button className="px-3 py-1 bg-black text-white cursor-pointer" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
