"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.login(email, password);
      window.location.href = "/home";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 블랙 패널 */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-gray-900 text-xs font-black">F</span>
          </div>
          <span className="text-white font-bold">FitLog</span>
        </div>

        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-5">Sneaker Fit Platform</p>
          <h2 className="font-black text-white leading-none mb-6">
            <span className="block text-5xl">PERFECT</span>
            <span className="block text-5xl">FIT.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            나와 같은 신발을 신는 유저들의 실제 착용 데이터 기반 사이즈 추천 서비스
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["Nike", "Jordan", "Adidas", "New Balance", "Vans"].map((brand) => (
            <span key={brand} className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-500 text-xs">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* 오른쪽 폼 */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1.5">다시 오셨군요</h1>
            <p className="text-gray-400 text-sm">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm"
                required
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  로그인 중
                </span>
              ) : "로그인 →"}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-400">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-gray-900 font-semibold hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}