"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/useAuthStore";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function useRequireAdmin() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const isAdmin = ADMIN_EMAIL && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (!isAdmin) {
      router.push("/orders");
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}