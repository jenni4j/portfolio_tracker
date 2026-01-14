import { useEffect, useState } from "react";

interface Result {
  symbol: string;
  name: string;
  exchange: string;
}

export default function StockSearch({ onSelect }: { onSelect: (r: Result) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(
        `https://portfolio-tracker-server-ten.vercel.app/api/search?q=${query}`
      );
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Search stocks..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="absolute bg-white border rounded shadow w-full mt-1 z-10">
          {results.map(r => (
            <div
              key={r.symbol}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(r);
                setQuery("");
                setResults([]);
              }}
            >
              <div className="font-semibold">{r.symbol}</div>
              <div className="text-sm text-gray-600">{r.name}</div>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="absolute right-3 top-3 text-sm">…</div>}
    </div>
  );
}
