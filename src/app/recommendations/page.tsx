"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productApi, recommendationApi, authApi, itemApi } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sizeMin: number;
  sizeMax: number;
  sizeStep: number;
}

interface DistributionItem {
  size: number;
  fit: string;
  count: number;
  percentage: number;
}

interface RecommendationResult {
  productId: number;
  productName: string;
  recommendedSize: number | null;
  recommendedFit: string | null;
  confidence: string;
  totalUsers: number;
  distribution: DistributionItem[];
}

const fitLabel = (fit: string) =>
  fit === "TIGHT" ? "타이트" : fit === "PERFECT" ? "딱 맞음" : "여유있음";

const confidenceConfig = (c: string) =>
  ({
    HIGH: { label: "높음", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
    MEDIUM: { label: "보통", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    LOW: { label: "낮음", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
    NO_DATA: { label: "데이터 없음", color: "text-text-secondary", bg: "bg-surface-2 border-border" },
  }[c] ?? { label: c, color: "text-text-secondary", bg: "bg-surface-2 border-border" });

export default function RecommendationsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [myItems, setMyItems] = useState<{ productId: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchInit();
  }, [router]);

  const fetchInit = async () => {
    try {
      const [productsData, userInfo, myItemsData] = await Promise.all([
        productApi.search(),
        authApi.getMyInfo(),
        itemApi.getMyItems(),
      ]);
      setProducts(productsData);
      setNickname(userInfo.nickname);
      setMyItems(myItemsData);
    } catch {
      router.push("/login");
    } finally {
      setPageLoading(false);
    }
  };

  const handleRecommend = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await recommendationApi.recommend(selectedProductId);
      setResult(data);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const myProductIds = new Set(myItems.map((item) => item.productId));
  const availableProducts = products.filter((p) => !myProductIds.has(p.id));
  const confidence = result ? confidenceConfig(result.confidence) : null;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar nickname={nickname} />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-primary text-sm font-medium mb-2">AI 사이즈 추천</p>
          <h1 className="text-4xl font-black text-text-primary">어떤 신발이 궁금하세요?</h1>
          <p className="text-text-secondary mt-2">나와 유사한 유저들의 실제 착용 데이터로 추천해드려요</p>
        </div>

        {/* 검색 영역 */}
        <div className="p-6 rounded-3xl bg-surface border border-border mb-8">
          <div className="flex gap-3">
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => {
                setSelectedProductId(Number(e.target.value));
                setResult(null);
              }}
              className="flex-1 bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-text-primary focus:outline-none focus:border-primary transition-colors text-sm"
            >
              <option value="">신발을 선택하세요</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleRecommend}
              disabled={!selectedProductId || loading}
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  분석 중
                </span>
              ) : "추천 받기"}
            </button>
          </div>
          {availableProducts.length === 0 && (
            <p className="text-text-secondary text-xs mt-3">
              모든 신발을 보유 중이에요. 새로운 신발이 등록되면 추천받을 수 있어요.
            </p>
          )}
        </div>

        {/* 결과 */}
        {result && (
          <div className="animate-fade-up space-y-4">
            {result.confidence === "NO_DATA" ? (
              <div className="p-12 rounded-3xl bg-surface border border-border text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-text-primary font-semibold text-lg mb-2">데이터가 부족해요</p>
                <p className="text-text-secondary text-sm">
                  신발장에 신발을 더 등록할수록 추천 정확도가 높아져요
                </p>
              </div>
            ) : (
              <>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-surface border border-primary/30">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">{result.productName}</p>
                      <p className="text-text-secondary text-xs uppercase tracking-wider">추천 사이즈</p>
                    </div>
                    {confidence && (
                      <span className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${confidence.bg} ${confidence.color}`}>
                        신뢰도 {confidence.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end gap-4 mb-6">
                    <span className="text-8xl font-black text-text-primary leading-none">
                      {result.recommendedSize}
                    </span>
                    <div className="pb-2">
                      <span className="text-2xl text-text-secondary font-light">mm</span>
                      {result.recommendedFit && (
                        <p className="text-text-secondary text-sm mt-1">
                          핏: {fitLabel(result.recommendedFit)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm">
                    {result.totalUsers}명의 유사 유저 데이터 기반
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-surface border border-border">
                  <p className="text-text-primary font-semibold mb-6">사이즈 분포</p>
                  <div className="space-y-4">
                    {result.distribution.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-text-primary font-bold text-sm w-16">{item.size}mm</span>
                            <span className="text-text-secondary text-xs">{fitLabel(item.fit)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-text-secondary text-xs">{item.count}명</span>
                            <span className="text-text-primary text-sm font-semibold w-12 text-right">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 안내 */}
        {!result && !loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "👟", title: "신발 선택", desc: "추천받고 싶은 신발을 선택하세요" },
              { icon: "🔍", title: "데이터 분석", desc: "유사 유저 매칭 후 통계 집계" },
              { icon: "✨", title: "사이즈 추천", desc: "최적 사이즈와 핏감을 추천" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-3xl bg-surface border border-border">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-text-primary font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}