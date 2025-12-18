import express from "express";
import cors from "cors";
import YahooFinance from "yahoo-finance2";

const app = express();
const yf = new YahooFinance();

app.use(cors());
app.use(express.json());

app.get("/api/quotes", async (req, res) => {
  try {
    const tickers = req.query.tickers?.toString();
    if (!tickers) return res.status(400).json({ error: "tickers required" });

    const symbols = tickers.split(",");

    const mapped = await Promise.all(
      symbols.map(async (ticker) => {
        const summary = await yf.quoteSummary(ticker, {
          modules: ["assetProfile", "price"],
        });

        return {
          ticker,
          name: summary.price?.longName ?? ticker,
          description: summary.assetProfile?.industry ?? "",
          lastPrice: summary.price?.regularMarketPrice ?? 0,
        };
      })
    );

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch yahoo finance data" });
  }
});

export default app;
