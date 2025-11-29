import { NavLink } from "react-router-dom";

export default function Navbar() {
  const tabs = [
    { label: "Home", path: "/" },
    { label: "Portfolios", path: "/portfolio" },
    { label: "Charts", path: "/charts" },
    { label: "Watchlists", path: "/watchlists" },
    { label: "Performance", path: "/performance" },
  ];

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
      </ul>
    </nav>
  );
}
