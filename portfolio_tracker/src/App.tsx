import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Chart";
import Watchlists from "./pages/Watchlist";
import Performance from "./pages/Performance";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/watchlists" element={<Watchlists />} />
        <Route path="/performance" element={<Performance />} />
      </Routes>
    </BrowserRouter>
  );
}
