"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-bg overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* 네비게이션 */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-text-primary font-bold text-xl tracking-tight">FitLog</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            로그인
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-medium">데이터 기반 사이즈 추천</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-text-primary leading-tight tracking-tight mb-6">
            당신만의
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              퍼펙트 핏
            </span>
            <br />
            찾기
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-xl">
            나와 같은 신발을 같은 사이즈로 신는 유저들의 데이터로
            원하는 신발의 사이즈를 추천해드립니다.
            더 이상 반품 걱정 없이 쇼핑하세요.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold text-base transition-all hover:scale-105 active:scale-95"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary rounded-2xl font-semibold text-base transition-all"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* 통계 */}
        <div className="mt-24 grid grid-cols-3 gap-6 max-w-xl">
          {[
            { value: "98%", label: "추천 만족도" },
            { value: "0", label: "반품 경험" },
            { value: "∞", label: "사이즈 고민" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-3xl bg-surface border border-border">
              <div className="text-3xl font-black text-text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 피처 섹션 */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-32">
        <h2 className="text-3xl font-bold text-text-primary mb-12">어떻게 작동하나요?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "신발장 등록",
              desc: "현재 보유한 신발과 착용 사이즈, 핏감을 등록하세요.",
              color: "from-primary/20 to-primary/5",
            },
            {
              step: "02",
              title: "유사 유저 매칭",
              desc: "나와 같은 신발을 같은 사이즈로 신는 유저를 자동으로 찾아냅니다.",
              color: "from-accent/20 to-accent/5",
            },
            {
              step: "03",
              title: "사이즈 추천",
              desc: "유사 유저들의 실제 착용 데이터를 기반으로 최적의 사이즈를 추천합니다.",
              color: "from-purple-500/20 to-purple-500/5",
            },
          ].map((feature) => (
            <div
              key={feature.step}
              className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} border border-border hover:border-primary/30 transition-all group`}
            >
              <div className="text-5xl font-black text-border group-hover:text-primary/30 transition-colors mb-6">
                {feature.step}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}