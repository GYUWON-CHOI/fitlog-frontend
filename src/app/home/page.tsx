"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { itemApi, authApi } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Item {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  size: number;
  fit: string;
  thumbnailUrl: string;
}

const fitLabel = (fit: string) =>
  fit === "TIGHT" ? "타이트" : fit === "PERFECT" ? "딱 맞음" : "여유있음";

const fitColor = (fit: string) =>
  fit === "TIGHT"
    ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
    : fit === "PERFECT"
    ? "text-green-400 bg-green-400/10 border-green-400/20"
    : "text-blue-400 bg-blue-400/10 border-blue-400/20";

export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [itemsData, userInfo] = await Promise.all([
        itemApi.getMyItems(),
        authApi.getMyInfo(),
      ]);
      setItems(itemsData);
      setNickname(userInfo.nickname);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const recentItems = items.slice(0, 3);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar nickname={nickname} />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-12">
          <p className="text-text-secondary text-sm mb-2">안녕하세요 👋</p>
          <h1 className="text-4xl font-black text-text-primary">
            {nickname}님의 핏 대시보드
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-3xl bg-surface border border-border">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">보유 신발</p>
            <p className="text-4xl font-black text-text-primary">{items.length}</p>
            <p className="text-text-secondary text-sm mt-1">켤레</p>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-surface border border-primary/30">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">핏 프로필</p>
            <p className="text-4xl font-black text-text-primary">
              {items.length > 0 ? "완성" : "미완성"}
            </p>
            <p className="text-text-secondary text-sm mt-1">
              {items.length > 0 ? "추천 가능 상태" : "신발 등록 필요"}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-surface border border-border">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">추천 상태</p>
            <p className="text-4xl font-black text-text-primary">
              {items.length >= 3 ? "최적" : items.length >= 1 ? "양호" : "부족"}
            </p>
            <p className="text-text-secondary text-sm mt-1">
              {items.length >= 3 ? "데이터 충분" : `${3 - items.length}켤레 더 필요`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/recommendations"
            className="group p-6 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                ✨
              </div>
              <span className="text-text-secondary group-hover:text-primary transition-colors text-lg">→</span>
            </div>
            <p className="text-text-primary font-bold text-lg mb-1">사이즈 추천받기</p>
            <p className="text-text-secondary text-sm">갖고 싶은 신발의 사이즈를 추천해드려요</p>
          </Link>

          <Link
            href="/items"
            className="group p-6 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl">
                👟
              </div>
              <span className="text-text-secondary group-hover:text-primary transition-colors text-lg">→</span>
            </div>
            <p className="text-text-primary font-bold text-lg mb-1">신발장 관리</p>
            <p className="text-text-secondary text-sm">보유 신발을 등록하고 관리하세요</p>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-text-primary font-bold">최근 등록 신발</p>
            <Link href="/items" className="text-primary text-sm hover:text-accent transition-colors">
              전체 보기
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="p-8 rounded-3xl bg-surface border border-dashed border-border text-center">
              <p className="text-text-secondary text-sm mb-4">아직 등록된 신발이 없어요</p>
              <Link
                href="/items"
                className="inline-flex px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all"
              >
                신발 추가하기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all hover:-translate-y-1"
                >
                  <div className="w-full h-32 rounded-2xl bg-surface-2 border border-border overflow-hidden flex items-center justify-center mb-4">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl">👟</span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs mb-1">{item.brand}</p>
                  <p className="text-text-primary font-semibold text-sm leading-tight mb-3 line-clamp-2">
                    {item.productName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-primary text-xs font-bold">
                      {item.size}mm
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${fitColor(item.fit)}`}>
                      {fitLabel(item.fit)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}