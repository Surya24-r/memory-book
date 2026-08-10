"use client";

import { useState } from "react";
import { useAuthStore } from "@/components/store/useAuthStore";

export default function SignupPage() {
  const signUp = useAuthStore((s) => s.signUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await signUp(email, password);
      setMessage("Check your email to confirm your account, then log in.");
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FAF9F7] px-6">
      <div className="w-full max-w-[420px] bg-white border border-[#E5E5E5] rounded-[24px] p-8">
        <h1 className="text-[32px] font-serif text-[#111111]">Create your account</h1>
        <p className="mt-2 text-[15px] text-[#666666]">Start crafting your own MemoryBook.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-[#333333]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] px-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#F4B323]"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#333333]">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] px-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#F4B323]"
            />
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}
          {message && <p className="text-[13px] text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] rounded-full bg-[#F4B323] text-[#111111] font-semibold hover:bg-[#e0a31f] transition disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#666666]">
          Already have an account?{" "}
          <a href="/login" className="text-[#F4B323] font-medium">Log in</a>
        </p>
      </div>
    </section>
  );
}