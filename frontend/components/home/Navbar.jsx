"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/useAuthStore";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const signOut = useAuthStore((s) => s.signOut);

  const isAdmin =
    ADMIN_EMAIL && user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <nav className="h-[88px] px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Group 1.svg"
            alt="memory-logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <span className="font-audiowide text-[15px] leading-[24px] tracking-[-0.6px] text-[#121212]">
            MemoryBook
          </span>
        </Link>
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-[16px] font-medium text-black hover:text-[#F5B719] transition"
          >
            Home
          </Link>
          <Link
            href="/templates"
            className="text-[16px] text-[#666666] hover:text-black transition"
          >
            Templates
          </Link>

          {isAdmin ? (
            <Link
              href="/admin"
              className="text-[16px] text-[#666666] hover:text-black transition"
            >
              Admin
            </Link>
          ) : (
            <Link
              href="/orders"
              className="text-[16px] text-[#666666] hover:text-black transition"
            >
              My Orders
            </Link>
          )}

          <Link
            href="/contact"
            className="text-[16px] text-[#666666] hover:text-black transition"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {/* While the session is still being determined, render nothing in
              this slot rather than flashing "Login" then swapping to the
              logged-in state a moment later. */}
          {isLoading ? (
            <div className="w-[92px] h-[46px]" />
          ) : user ? (
            <>
              <span className="text-[14px] text-[#666666] hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#111111] text-white px-7 py-3 rounded-full text-[15px] font-medium hover:bg-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#111111] text-white px-7 py-3 rounded-full text-[15px] font-medium hover:bg-black transition"
            >
              Login
            </Link>
          )}

          {!isAdmin && (
            <Link
              href="/create"
              className="bg-[#FBBF24] text-black px-7 py-3 rounded-full text-[15px] font-medium hover:bg-[#F2B316] transition"
            >
              Create your own book
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}