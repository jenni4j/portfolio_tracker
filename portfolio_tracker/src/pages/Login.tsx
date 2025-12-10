import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    login(data.token, email);
    navigate("/portfolio");
  };

  return (
    <div className="flex justify-center mt-20">
      <form
        className="p-6 border rounded shadow flex flex-col gap-3 w-100"
        onSubmit={handleLogin}
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          className="border p-2 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="px-3 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white shadow-sm hover:bg-[#eef4ff] transition cursor-pointer">
          Enter
        </button>

        {error && (
          <p className="text-center text-sm text-red-600 mt-2">{error}</p>
        )}

        <p className="text-center text-sm mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
