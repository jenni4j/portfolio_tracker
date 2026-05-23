import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { BASE_URL } from "../lib/api";
import { timeAgo, type NewsItem } from "../lib/utils";

const INDEX_TICKERS = ["^GSPC", "^IXIC", "^DJI", "^RUT"];
const INDEX_LABELS: Record<string, string> = {
  "^GSPC": "S&P 500",
  "^IXIC": "NASDAQ",
  "^DJI": "Dow Jones",
  "^RUT": "Russell 2000",
};

interface IndexQuote {
  ticker: string;
  displayName: string;
  lastPrice: number;
  regularMarketChangePercent: number;
}

export default function Home() {
  const [displayName, setDisplayName] = useState<string>("");
  const [indices, setIndices] = useState<IndexQuote[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Round 1: user identity + indices in parallel
      const [userRes, indicesRaw] = await Promise.all([
        supabase.auth.getUser(),
        fetch(`${BASE_URL}/api/quotes?tickers=${INDEX_TICKERS.join(",")}`)
          .then((r) => r.json())
          .catch(() => []),
      ]);

      const rawUser = userRes.data?.user;
      const name =
        rawUser?.user_metadata?.full_name ??
        rawUser?.email?.split("@")[0] ??
        "Investor";
      setDisplayName(name);

      const indexQuotes: IndexQuote[] = INDEX_TICKERS.map((t) => {
        const q = (indicesRaw as any[]).find((x: any) => x.ticker === t);
        return {
          ticker: t,
          displayName: INDEX_LABELS[t] ?? t,
          lastPrice: q?.lastPrice ?? 0,
          regularMarketChangePercent: q?.regularMarketChangePercent ?? 0,
        };
      });
      setIndices(indexQuotes);

      if (!rawUser) {
        setLoading(false);
        return;
      }

      // Round 2: collect unique tickers from portfolio + watchlist
      const [{ data: stocksData }, { data: watchlistData }] = await Promise.all([
        supabase.from("stocks").select("ticker").eq("user_id", rawUser.id),
        supabase.from("watchlist").select("ticker").eq("user_id", rawUser.id),
      ]);

      const allTickers = [
        ...new Set([
          ...(stocksData ?? []).map((s: any) => s.ticker as string),
          ...(watchlistData ?? []).map((e: any) => e.ticker as string),
        ]),
      ];

      // Round 3: news for all tickers
      if (allTickers.length) {
        const newsRaw = await fetch(`${BASE_URL}/api/news?tickers=${allTickers.join(",")}`)
          .then((r) => r.json())
          .catch(() => []);
        setNews(Array.isArray(newsRaw) ? newsRaw : []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 pb-16 px-4">

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {greeting}{displayName ? `, ${displayName}` : ""}.
        </h1>
        <p className="text-sm text-gray-500 mt-1">{todayStr}</p>
      </div>

      {/* Market Pulse strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {indices.length === 0
          ? INDEX_TICKERS.map((t) => (
              <div key={t} className="rounded-xl border border-gray-200 shadow-sm bg-white px-4 py-3 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          : indices.map((idx) => {
              const pctVal = idx.regularMarketChangePercent * 100;
              const isUp = pctVal >= 0;
              return (
                <div
                  key={idx.ticker}
                  className="rounded-xl border border-gray-200 shadow-sm bg-white px-4 py-3"
                >
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    {idx.displayName}
                  </div>
                  <div className="text-base font-bold tabular-nums text-gray-800">
                    {idx.lastPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className={`text-sm font-semibold tabular-nums ${isUp ? "text-green-600" : "text-red-600"}`}>
                    {isUp ? "+" : ""}{pctVal.toFixed(2)}%
                  </div>
                </div>
              );
            })}
      </div>

      {/* Recent news*/}
      {!loading && news.length > 0 && (
        <div className="rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-800">Recent headlines for your stocks</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {news.map((item) => (
              <li key={item.uuid} className="px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-800 hover:text-blue-600 leading-snug block mb-1.5"
                >
                  {item.title}
                </a>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-1.5 py-0.5 rounded bg-[#eef4ff] text-blue-700 font-semibold">{item.ticker}</span>
                  <span>{item.publisher}</span>
                  <span>·</span>
                  <span>{timeAgo(item.publishedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
