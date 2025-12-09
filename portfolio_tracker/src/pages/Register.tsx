import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        navigate("/login");
      } else {
        setMessage(data.error || "Registration failed");
      }
    };

  return (
    <div className="flex justify-center mt-20">
      <form
        className="p-6 border rounded shadow flex flex-col gap-3 w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

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

        <button className="py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white shadow-sm hover:bg-[#eef4ff] transition">
          Save
        </button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
