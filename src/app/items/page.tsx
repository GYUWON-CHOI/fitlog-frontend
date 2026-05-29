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

const fitColor = (fit: string) =>
  fit === "TIGHT"
    ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
    : fit === "PERFECT"
    ? "text-green-400 bg-green-400/10 border-green-400/20"
    : "text-blue-400 bg-blue-400/10 border-blue-400/20";

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
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar nickname={nickname} />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-text-secondary text-sm mb-1">@{nickname}</p>
            <h1 className="text-4xl font-black text-text-primary">나의 신발장</h1>
            <p className="text-text-secondary mt-2">{items.length}켤레 보유 중</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-medium transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-lg leading-none">+</span>
            신발 추가
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border">
            <div className="text-5xl mb-4">👟</div>
            <p className="text-text-primary font-semibold text-lg mb-2">신발장이 비어있어요</p>
            <p className="text-text-secondary text-sm mb-6">신발을 등록하면 더 정확한 추천을 받을 수 있어요</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-medium transition-all"
            >
              첫 신발 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group p-6 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border overflow-hidden flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl">👟</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all"
                  >
                    <span className="text-red-400 text-sm">×</span>
                  </button>
                </div>

                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">
                  {item.brand}
                </p>
                <p className="text-text-primary font-semibold leading-tight mb-4 line-clamp-2">
                  {item.productName}
                </p>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-text-primary text-sm font-bold">
                    {item.size}mm
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-medium ${fitColor(item.fit)}`}>
                    {fitLabel(item.fit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">신발 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  제품 선택
                </label>
                <select
                  value={selectedProductId ?? ""}
                  onChange={(e) => {
                    setSelectedProductId(Number(e.target.value));
                    setSelectedSize(null);
                  }}
                  className="w-full bg-surface-2 border border-border rounded-2xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors text-sm"
                >
                  <option value="">제품을 선택하세요</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    착용 사이즈
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          selectedSize === s
                            ? "bg-primary border-primary text-white"
                            : "bg-surface-2 border-border text-text-secondary hover:border-primary/50 hover:text-text-primary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  핏감
                </label>
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
                          ? "bg-primary border-primary text-white"
                          : "bg-surface-2 border-border text-text-secondary hover:border-primary/50"
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
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-2xl font-semibold transition-all"
              >
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    추가 중...
                  </span>
                ) : "신발장에 추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}