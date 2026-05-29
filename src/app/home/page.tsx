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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const recentItems = items.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar nickname={nickname} />

      <div className="max-w-screen-xl mx-auto px-6 pt-14">
        {/* 헤더 */}
        <div className="flex items-center justify-between py-10 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-4xl font-black text-gray-900">{nickname}</h1>
          </div>
          <Link href="/recommendations" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm transition-colors">
            추천 받기 →
          </Link>
        </div>

        {/* 스탯 */}
        <div className="grid grid-cols-3 gap-4 py-8 border-b border-gray-100">
          {[
            { value: items.length.toString(), unit: "켤레", label: "보유 신발" },
            { value: items.length > 0 ? "활성" : "비활성", unit: "", label: "핏 프로필" },
            { value: items.length >= 3 ? "최적" : items.length >= 1 ? "양호" : "부족", unit: "", label: "추천 상태" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-black text-gray-900">{stat.value}</span>
                {stat.unit && <span className="text-gray-400 text-sm">{stat.unit}</span>}
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 최근 신발 */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Collection</p>
              <h2 className="text-xl font-black text-gray-900">최근 신발</h2>
            </div>
            <Link href="/items" className="text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider">
              전체 보기 →
            </Link>
          </div>

          {recentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm mb-4">아직 등록된 신발이 없어요</p>
              <Link href="/items" className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors">
                신발 추가하기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recentItems.map((item) => (
                <div key={item.id} className="group rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all hover:-translate-y-0.5">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl">👟</span>
                    )}
                  </div>
                  <div className="p-3 bg-white border-t border-gray-100">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{item.brand}</p>
                    <p className="text-gray-900 text-sm font-semibold leading-tight line-clamp-1 mb-2">{item.productName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-gray-900 text-white text-xs font-bold">{item.size}mm</span>
                      <span className="text-gray-400 text-xs">{fitLabel(item.fit)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 퀵 액션 */}
        <div className="grid grid-cols-2 gap-4 pb-10 border-t border-gray-100 pt-6">
          {[
            { href: "/recommendations", title: "사이즈 추천받기", desc: "갖고 싶은 신발의 사이즈를 추천해드려요" },
            { href: "/items", title: "신발장 관리", desc: "보유 신발을 등록하고 관리하세요" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-0.5">{action.title}</p>
                <p className="text-gray-400 text-xs">{action.desc}</p>
              </div>
              <span className="text-gray-300 group-hover:text-gray-900 transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}