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

  const navLinks = [
    { href: "/home", label: "홈" },
    { href: "/items", label: "신발장" },
    { href: "/recommendations", label: "추천" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-black">F</span>
          </div>
          <span className="text-gray-900 font-bold text-base">FitLog</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {nickname && (
            <>
              <span className="text-xs text-gray-500 font-medium px-3 py-2 bg-gray-50 rounded-lg">
                {nickname}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}