"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api";

interface NavbarProps {
  nickname?: string;
}

export default function Navbar({ nickname }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="text-text-primary font-bold text-lg tracking-tight">FitLog</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/home"
            className={`text-sm font-medium transition-colors ${
              pathname === "/home" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            홈
          </Link>
          <Link
            href="/items"
            className={`text-sm font-medium transition-colors ${
              pathname === "/items" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            신발장
          </Link>
          <Link
            href="/recommendations"
            className={`text-sm font-medium transition-colors ${
              pathname === "/recommendations" ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            추천
          </Link>
          {nickname && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                <span className="text-text-secondary text-xs font-medium">
                  {nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}