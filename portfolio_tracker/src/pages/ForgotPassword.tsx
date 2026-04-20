import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full">

        {submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-1">Check your inbox</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a password reset link to <span className="font-medium text-gray-800">{email}</span>. Follow the link in the email to set a new password.
            </p>
            <Link to="/login" className="text-sm text-gray-900 font-semibold underline underline-offset-2">
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>
            <p className="text-sm text-gray-500 mb-8">Enter your email and we'll send you a reset link.</p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                <input
                  className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="you@example.com"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button className="mt-1 px-3 py-2.5 text-sm font-semibold rounded-lg bg-gray-950 text-white hover:bg-gray-800 transition cursor-pointer">
                Send reset link
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
