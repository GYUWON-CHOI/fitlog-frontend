"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productApi, recommendationApi, authApi } from "@/lib/api";

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

const confidenceLabel = (c: string) =>
  c === "HIGH" ? "높음" : c === "MEDIUM" ? "보통" : c === "LOW" ? "낮음 (참고용)" : "데이터 없음";

const confidenceColor = (c: string) =>
  c === "HIGH" ? "text-green-600" : c === "MEDIUM" ? "text-yellow-600" : c === "LOW" ? "text-orange-500" : "text-gray-400";

export default function RecommendationsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchInit();
  }, [router]);

  const fetchInit = async () => {
    try {
      const [productsData, userInfo] = await Promise.all([
        productApi.search(),
        authApi.getMyInfo(),
      ]);
      setProducts(productsData);
      setNickname(userInfo.nickname);
    } catch {
      router.push("/login");
    }
  };

  const handleRecommend = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const data = await recommendationApi.recommend(selectedProductId);
      setResult(data);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FitLog</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{nickname}</span>
          <Link href="/items" className="text-sm text-blue-600 hover:underline">
            내 신발장
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black">
            로그아웃
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">사이즈 추천</h2>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <p className="text-sm text-gray-500 mb-4">
            원하는 신발을 선택하면 나와 비슷한 유저들의 착용 데이터를 바탕으로 사이즈를 추천해드려요.
          </p>
          <div className="flex gap-3">
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => {
                setSelectedProductId(Number(e.target.value));
                setResult(null);
              }}
              className="flex-1 border rounded-lg px-4 py-2"
            >
              <option value="">신발 선택</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleRecommend}
              disabled={!selectedProductId || loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "조회 중..." : "추천 받기"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">{result.productName}</h3>

            {result.confidence === "NO_DATA" ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-2">😢</p>
                <p>아직 데이터가 부족해요.</p>
                <p className="text-sm mt-1">내 신발장에 신발을 더 등록하면 추천 정확도가 올라가요!</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">추천 사이즈</p>
                  <p className="text-3xl font-bold">{result.recommendedSize}mm</p>
                  {result.recommendedFit && (
                    <p className="text-sm text-gray-600 mt-1">핏: {fitLabel(result.recommendedFit)}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">신뢰도:</span>
                    <span className={`text-sm font-medium ${confidenceColor(result.confidence)}`}>
                      {confidenceLabel(result.confidence)}
                    </span>
                    <span className="text-sm text-gray-400">({result.totalUsers}명 기준)</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">사이즈 분포</p>
                  <div className="flex flex-col gap-2">
                    {result.distribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm w-20 text-gray-600">
                          {item.size}mm
                        </span>
                        <span className="text-xs w-14 text-gray-400">
                          {fitLabel(item.fit)}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-black rounded-full h-2"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {item.count}명 ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}