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
    HIGH: { label: "HIGH", badge: "bg-green-50 text-green-600 border border-green-200", width: "100%" },
    MEDIUM: { label: "MEDIUM", badge: "bg-yellow-50 text-yellow-600 border border-yellow-200", width: "66%" },
    LOW: { label: "LOW", badge: "bg-orange-50 text-orange-500 border border-orange-200", width: "33%" },
    NO_DATA: { label: "NO DATA", badge: "bg-gray-100 text-gray-400 border border-gray-200", width: "0%" },
  }[c] ?? { label: c, badge: "bg-gray-100 text-gray-400 border border-gray-200", width: "0%" });

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const myProductIds = new Set(myItems.map((item) => item.productId));
  const availableProducts = products.filter((p) => !myProductIds.has(p.id));
  const confidence = result ? confidenceConfig(result.confidence) : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar nickname={nickname} />

      <div className="max-w-screen-xl mx-auto px-6 pt-14">
        <div className="flex items-center justify-between py-10 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Size Recommendation</p>
            <h1 className="text-4xl font-black text-gray-900">사이즈 추천</h1>
            <p className="text-gray-400 text-sm mt-1">유사 유저 착용 데이터 기반</p>
          </div>
        </div>

        <div className="py-8 max-w-2xl">
          {/* 검색 */}
          <div className="flex gap-3 mb-8">
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => { setSelectedProductId(Number(e.target.value)); setResult(null); }}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-all text-sm"
            >
              <option value="">추천받고 싶은 신발을 선택하세요</option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} {p.name}</option>
              ))}
            </select>
            <button
              onClick={handleRecommend}
              disabled={!selectedProductId || loading}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  분석 중
                </span>
              ) : "추천 받기 →"}
            </button>
          </div>

          {availableProducts.length === 0 && (
            <p className="text-gray-400 text-xs mb-6">모든 신발을 보유 중이에요.</p>
          )}

          {/* 결과 */}
          {result && (
            <div className="space-y-4">
              {result.confidence === "NO_DATA" ? (
                <div className="py-16 rounded-2xl border border-dashed border-gray-200 text-center">
                  <p className="text-gray-900 font-bold mb-2">데이터가 부족해요</p>
                  <p className="text-gray-400 text-sm">신발장에 신발을 더 등록할수록 정확도가 높아져요</p>
                </div>
              ) : (
                <>
                  <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{result.productName}</p>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">추천 사이즈</p>
                      </div>
                      {confidence && (
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest ${confidence.badge}`}>
                          {confidence.label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-8xl font-black text-gray-900 leading-none">{result.recommendedSize}</span>
                      <div>
                        <span className="text-2xl text-gray-400 font-light">mm</span>
                        {result.recommendedFit && (
                          <p className="text-gray-400 text-sm mt-1">{fitLabel(result.recommendedFit)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        {confidence && (
                          <div className="h-full bg-gray-900 rounded-full transition-all duration-1000" style={{ width: confidence.width }} />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">{result.totalUsers}명 기준</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Distribution</p>
                    <div className="space-y-4">
                      {result.distribution.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-900 font-black text-sm w-16">{item.size}mm</span>
                              <span className="text-gray-400 text-xs">{fitLabel(item.fit)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400 text-xs">{item.count}명</span>
                              <span className="text-gray-900 font-bold text-sm w-10 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 rounded-full transition-all duration-700"
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

          {/* 기본 안내 */}
          {!result && !loading && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: "01", title: "신발 선택", desc: "추천받고 싶은 신발 선택" },
                { step: "02", title: "데이터 분석", desc: "유사 유저 매칭 및 통계" },
                { step: "03", title: "사이즈 추천", desc: "최적 사이즈 및 핏감 추천" },
              ].map((item) => (
                <div key={item.step} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-gray-300 text-xs font-black mb-3 font-mono">{item.step}</p>
                  <p className="text-gray-900 font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}