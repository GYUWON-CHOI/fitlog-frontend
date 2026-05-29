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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-gray-900 text-xs font-black">F</span>
          </div>
          <span className="text-white font-bold">FitLog</span>
        </div>

        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-5">Join FitLog</p>
          <h2 className="font-black text-white leading-none mb-6">
            <span className="block text-5xl">YOUR</span>
            <span className="block text-5xl">SNEAKER</span>
            <span className="block text-5xl">PROFILE.</span>
          </h2>
          <div className="space-y-3">
            {[
              "보유 신발로 나만의 핏 프로필 생성",
              "유사 유저 자동 매칭",
              "데이터 기반 정확한 사이즈 추천",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-gray-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gray-800 border border-gray-700">
          <p className="text-gray-400 text-sm italic mb-3">"사이즈 때문에 반품하는 일이 없어졌어요."</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-gray-300 text-xs font-semibold">스니커헤드</p>
              <p className="text-gray-600 text-xs">FitLog 사용자</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1.5">계정 만들기</h1>
            <p className="text-gray-400 text-sm">무료로 시작하세요</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { key: "nickname", label: "닉네임", type: "text", placeholder: "스니커헤드", value: nickname, setter: setNickname },
              { key: "email", label: "이메일", type: "email", placeholder: "hello@example.com", value: email, setter: setEmail },
              { key: "password", label: "비밀번호", type: "password", placeholder: "••••••••", value: password, setter: setPassword },
            ].map(({ key, label, type, placeholder, value, setter }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm"
                  required
                />
              </div>
            ))}

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
                  처리 중
                </span>
              ) : "가입하기 →"}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-400">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-gray-900 font-semibold hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}