import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Portfolios", path: "/portfolio" },
    { label: "Charts", path: "/charts" },
    { label: "Watchlists", path: "/watchlists" },
    { label: "Performance", path: "/performance" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <ul className="max-w-6xl mx-auto flex justify-between text-sm font-semibold tracking-wide">
        {tabs.map((tab) => (
          <li key={tab.path} className="w-full text-center">
            <NavLink
              to={tab.path}
              end
              className={({ isActive }) =>
                `block py-5 hover:bg-[#eef4ff] transition ${
                  isActive ? "border-b-2 border-black font-bold" : "text-gray-600"
                }`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
        {user && (
          <li className="w-full text-center">
            <button
              onClick={handleLogout}
              className="block py-5 px-3 text-sm font-semibold text-red-600 hover:bg-[#ffeaea] transition cursor-pointer"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
