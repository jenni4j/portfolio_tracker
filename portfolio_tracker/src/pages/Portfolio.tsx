import { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import type { Stock } from "../types/Stock";
import { supabase } from "../lib/supabaseClient";

interface Portfolio {
  id: number;
  name: string;
  stocks?: Stock[];
}

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = async () => {
    setLoading(true);
    const user = supabase.auth.getUser();
    const { data: userData } = await user;
    if (!userData?.user) return;

    const { data, error } = await supabase
      .from("portfolios")
      .select("id, name, user_id")
      .eq("user_id", userData.user.id)
      .order("id", { ascending: true });

    if (error) console.error(error);
    else setPortfolios(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const createPortfolio = async () => {
    const name = prompt("Enter a name for your new portfolio:");
    if (!name) return;

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("portfolios")
      .insert([{ name, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPortfolios((prev) => [...prev, data]);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Portfolios</h1>
        <button
          onClick={createPortfolio}
          className="px-3 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white shadow-sm hover:bg-[#eef4ff] transition cursor-pointer"
        >
          + New Portfolio
        </button>
      </div>

      {loading && <p>Loading portfolios...</p>}

      {portfolios.map((p) => (
        <PortfolioTable key={p.id} portfolio={p} />
      ))}
    </div>
  );
}
