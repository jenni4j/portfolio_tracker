import express from "express";
import cors from "cors";
import YahooFinance from "yahoo-finance2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: { email: string; passwordHash: string }[] = [];
const JWT_SECRET = "supersecret123";

const app = express();
const yf = new YahooFinance();
app.use(cors());
app.use(express.json());

const hardcodedStocks = {
  AAPL: { initialPrice: 10, shares: 10, value: 2150, returnPct: 6.35, pnl: 128 },
  MSFT: { initialPrice: 10, shares: 7, value: 1975, returnPct: 3.81, pnl: 72 },
  NVDA: { initialPrice: 10, shares: 5, value: 2430, returnPct: -4.12, pnl: -105 },
  AMZN: { initialPrice: 10, shares: 3, value: 552, returnPct: 12.88, pnl: 63 },
};

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  const existing = users.find((u) => u.email === email);
  if (existing)
    return res.status(400).json({ error: "user already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  users.push({ email, passwordHash });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "invalid credentials" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token });
});

app.get("/api/quotes", async (req, res) => {
  try {
    const tickers = req.query.tickers?.toString();
    if (!tickers) return res.status(400).json({ error: "tickers required" });

    const symbols = tickers.split(",");

    const mapped = await Promise.all(
      symbols.map(async (ticker) => {
        const summary = await yf.quoteSummary(ticker, { modules: ['assetProfile', 'price'] });
        
        const hardcoded = hardcodedStocks[ticker as keyof typeof hardcodedStocks] || {};
    
        return {
          ticker,
          name: summary.price?.longName ?? ticker,
          description: summary.assetProfile?.industry ?? "",
          lastPrice: summary.price?.regularMarketPrice ?? 0,
          initialPrice: hardcoded.initialPrice ?? 0,
          shares: hardcoded.shares ?? 0,
          value: hardcoded.value ?? 0,
          returnPct: hardcoded.returnPct ?? 0,
          pnl: hardcoded.pnl ?? 0,
        };
      })
    );

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch yahoo finance data" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
