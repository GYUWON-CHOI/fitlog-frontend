"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.signup(email, password, nickname);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-bg to-bg" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-text-primary font-bold text-xl">FitLog</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-text-primary leading-tight mb-6">
            신발 쇼핑의
            <br />
            <span className="text-accent">새로운 기준</span>
          </h2>
          <div className="space-y-4">
            {[
              "보유 신발 등록으로 나만의 핏 프로필 생성",
              "유사 유저 매칭으로 정확한 사이즈 추천",
              "데이터 기반 추천으로 반품 걱정 제로",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-text-secondary text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-6 rounded-3xl bg-surface/50 border border-border backdrop-blur-sm">
          <p className="text-text-secondary text-sm italic mb-3">
            "사이즈 때문에 반품하는 일이 없어졌어요."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30" />
            <div>
              <div className="text-text-primary text-sm font-medium">스니커헤드 유저</div>
              <div className="text-text-secondary text-xs">FitLog 사용자</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">계정 만들기</h1>
            <p className="text-text-secondary">무료로 시작하세요</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="스니커헤드"
                className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>

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
                  처리 중...
                </span>
              ) : "회원가입"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-text-secondary">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary hover:text-accent transition-colors font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}