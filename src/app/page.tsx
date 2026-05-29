"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/home");
  }, [router]);

  return (
    <main className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-screen-xl mx-auto border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-black">F</span>
          </div>
          <span className="text-gray-900 font-bold">FitLog</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-4 py-2">
            로그인
          </Link>
          <Link href="/signup" className="text-sm px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors">
            시작하기
          </Link>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="max-w-screen-xl mx-auto px-8 pt-20 pb-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            데이터 기반 사이즈 추천 플랫폼
          </span>

          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none tracking-tight mb-6">
            FIND<br />
            YOUR<br />
            <span className="text-gray-300">FIT.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
            나와 같은 신발을 신는 유저들의 실제 착용 데이터로
            원하는 신발의 사이즈를 추천해드립니다.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/signup" className="px-7 py-3.5 bg-gray-900 hover:bg-gray-700 text-white rounded-2xl font-semibold text-sm transition-colors">
              무료로 시작하기 →
            </Link>
            <Link href="/login" className="px-7 py-3.5 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 rounded-2xl font-semibold text-sm transition-colors">
              로그인
            </Link>
          </div>
        </div>

        {/* 통계 */}
        <div className="mt-24 grid grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden max-w-xl">
          {[
            { value: "실시간", label: "착용 데이터" },
            { value: "정확한", label: "유사 유저 매칭" },
            { value: "맞춤형", label: "사이즈 추천" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-6">
              <div className="text-xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 작동 방식 */}
        <div className="mt-20">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">작동 방식</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "신발장 등록", desc: "보유한 신발과 착용 사이즈, 핏감을 등록하세요." },
              { step: "02", title: "유사 유저 매칭", desc: "나와 같은 신발을 같은 사이즈로 신는 유저를 찾아냅니다." },
              { step: "03", title: "사이즈 추천", desc: "유사 유저들의 실제 데이터로 최적의 사이즈를 추천합니다." },
            ].map((f) => (
              <div key={f.step} className="p-7 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="text-4xl font-black text-gray-200 group-hover:text-gray-300 transition-colors mb-6 font-mono">
                  {f.step}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}