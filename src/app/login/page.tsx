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
      router.push("/items");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* 왼쪽 브랜딩 */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg to-bg" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-text-primary font-bold text-xl">FitLog</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-primary leading-tight mb-6">
            완벽한 핏을
            <br />
            <span className="text-primary">데이터로</span>
            <br />
            찾아드립니다
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            나와 같은 신발을 신는 유저들의
            <br />
            실제 착용 데이터 기반 추천 서비스
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          {["Nike", "Jordan", "Adidas", "New Balance", "Vans"].map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 rounded-full border border-border text-text-secondary text-xs"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">다시 오셨군요</h1>
            <p className="text-text-secondary">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  로그인 중...
                </span>
              ) : "로그인"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-text-secondary">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary hover:text-accent transition-colors font-medium">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}