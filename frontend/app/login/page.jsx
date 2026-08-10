"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/useAuthStore";
import { supabase } from "@/components/lib/supabaseClient";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signIn(email, password);

      // signIn() resolving doesn't guarantee every downstream reader
      // (fetchWithAuth's own supabase.auth.getSession() call) can see the
      // new session yet. Explicitly confirm it's retrievable before
      // navigating, so the very first requests fired by the next page
      // (e.g. Orders.jsx's useEffect) don't race ahead of it and get 401s.
      // Poll briefly rather than a single check, since propagation can
      // take more than one tick.
      let sessionReady = false;
      let loggedInEmail = null;
      for (let attempt = 0; attempt < 10; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          sessionReady = true;
          loggedInEmail = data.session.user?.email ?? null;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (!sessionReady) {
        console.warn("Session did not become readable within the expected time; navigating anyway.");
      }

      const isAdmin =
        ADMIN_EMAIL &&
        loggedInEmail &&
        loggedInEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      router.push(isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FAF9F7] px-6">
      <div className="w-full max-w-[420px] bg-white border border-[#E5E5E5] rounded-[24px] p-8">
        <h1 className="text-[32px] font-serif text-[#111111]">Welcome back</h1>
        <p className="mt-2 text-[15px] text-[#666666]">Log in to manage your MemoryBooks.</p>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] px-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#F4B323]"
            />
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] rounded-full bg-[#F4B323] text-[#111111] font-semibold hover:bg-[#e0a31f] transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#666666]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#F4B323] font-medium">Sign up</a>
        </p>
      </div>
    </section>
  );
}