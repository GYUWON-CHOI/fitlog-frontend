"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { itemApi, productApi, authApi } from "@/lib/api";
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

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sizeMin: number;
  sizeMax: number;
  sizeStep: number;
  thumbnailUrl: string;
}

const fitLabel = (fit: string) =>
  fit === "TIGHT" ? "타이트" : fit === "PERFECT" ? "딱 맞음" : "여유있음";

const fitBadge = (fit: string) =>
  fit === "TIGHT"
    ? "bg-orange-50 text-orange-500 border border-orange-100"
    : fit === "PERFECT"
    ? "bg-green-50 text-green-600 border border-green-100"
    : "bg-blue-50 text-blue-500 border border-blue-100";

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [nickname, setNickname] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedFit, setSelectedFit] = useState("PERFECT");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [itemsData, productsData, userInfo] = await Promise.all([
        itemApi.getMyItems(),
        productApi.search(),
        authApi.getMyInfo(),
      ]);
      setItems(itemsData);
      setProducts(productsData);
      setNickname(userInfo.nickname);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!selectedProductId || !selectedSize) return;
    setAdding(true);
    try {
      await itemApi.addItem(selectedProductId, selectedSize, selectedFit);
      setShowAddModal(false);
      setSelectedProductId(null);
      setSelectedSize(null);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await itemApi.deleteItem(id);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const sizeOptions = selectedProduct
    ? Array.from(
        { length: (selectedProduct.sizeMax - selectedProduct.sizeMin) / selectedProduct.sizeStep + 1 },
        (_, i) => selectedProduct.sizeMin + i * selectedProduct.sizeStep
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar nickname={nickname} />

      <div className="max-w-screen-xl mx-auto px-6 pt-14">
        <div className="flex items-center justify-between py-10 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Collection</p>
            <h1 className="text-4xl font-black text-gray-900">나의 신발장</h1>
            <p className="text-gray-400 text-sm mt-1">{items.length}켤레 보유 중</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            + 신발 추가
          </button>
        </div>

        <div className="py-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 rounded-2xl border border-dashed border-gray-200">
              <span className="text-5xl mb-4">👟</span>
              <p className="text-gray-900 font-semibold mb-1">신발장이 비어있어요</p>
              <p className="text-gray-400 text-sm mb-6">신발을 등록하면 더 정확한 추천을 받을 수 있어요</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                첫 신발 추가하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all hover:-translate-y-0.5"
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        width={250}
                        height={250}
                        className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-5xl">👟</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                  >
                    ×
                  </button>

                  <div className="p-3 bg-white border-t border-gray-100">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{item.brand}</p>
                    <p className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2 mb-2">{item.productName}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-gray-900 text-white text-xs font-bold">{item.size}mm</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${fitBadge(item.fit)}`}>{fitLabel(item.fit)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">신발 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >×</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">제품 선택</label>
                <select
                  value={selectedProductId ?? ""}
                  onChange={(e) => { setSelectedProductId(Number(e.target.value)); setSelectedSize(null); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900 transition-all text-sm"
                >
                  <option value="">제품을 선택하세요</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.brand} {p.name}</option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">착용 사이즈</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedSize === s
                            ? "bg-gray-900 border-gray-900 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">핏감</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "TIGHT", label: "타이트", emoji: "😬" },
                    { value: "PERFECT", label: "딱 맞음", emoji: "😊" },
                    { value: "LOOSE", label: "여유있음", emoji: "😌" },
                  ].map((fit) => (
                    <button
                      key={fit.value}
                      onClick={() => setSelectedFit(fit.value)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                        selectedFit === fit.value
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <span>{fit.emoji}</span>
                      <span className="text-xs">{fit.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddItem}
                disabled={!selectedProductId || !selectedSize || adding}
                className="w-full py-3.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white rounded-xl font-bold text-sm transition-colors"
              >
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    추가 중
                  </span>
                ) : "신발장에 추가 →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}