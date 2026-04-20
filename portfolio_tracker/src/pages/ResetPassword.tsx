import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when it detects the reset token in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full text-center">
          <p className="text-sm text-gray-500">Verifying your reset link…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full">

        {done ? (
          <>
            <h2 className="text-2xl font-bold mb-1">Password updated</h2>
            <p className="text-sm text-gray-500">
              Your password has been changed. Redirecting you to sign in…
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">Set new password</h2>
            <p className="text-sm text-gray-500 mb-8">Choose a new password for your account.</p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">New password</label>
                <input
                  className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="••••••••"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm password</label>
                <input
                  className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="••••••••"
                  type="password"
                  required
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button className="mt-1 px-3 py-2.5 text-sm font-semibold rounded-lg bg-gray-950 text-white hover:bg-gray-800 transition cursor-pointer">
                Update password
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-6 text-center">
              <Link to="/login" className="text-gray-900 font-semibold underline underline-offset-2">
                Back to sign in
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
