import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>

      <div className="flex gap-6">
        <Link
          to="/login"
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
