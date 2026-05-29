"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { productApi } from "@/lib/api";
import Navbar from "@/components/Navbar";

const BASE_URL = "http://localhost:8080";

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

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "SHOES",
    sizeMin: 220,
    sizeMax: 300,
    sizeStep: 5,
    thumbnailUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const data = await productApi.search();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setShowForm(false);
      setForm({ name: "", brand: "", category: "SHOES", sizeMin: 220, sizeMax: 300, sizeStep: 5, thumbnailUrl: "" });
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-medium mb-2">관리자</p>
            <h1 className="text-4xl font-black text-text-primary">제품 관리</h1>
            <p className="text-text-secondary mt-2">{products.length}개 등록됨</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-medium transition-all hover:scale-105"
          >
            + 제품 등록
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group p-5 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all"
            >
              <div className="w-full h-40 rounded-2xl bg-surface-2 border border-border mb-4 overflow-hidden flex items-center justify-center">
                {product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-4xl">👟</span>
                )}
              </div>
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{product.brand}</p>
              <p className="text-text-primary font-semibold text-sm leading-tight mb-2">{product.name}</p>
              <p className="text-text-secondary text-xs mb-3">
                {product.sizeMin}~{product.sizeMax}mm / {product.sizeStep}mm 단위
              </p>
              <button
                onClick={() => handleDelete(product.id)}
                className="opacity-0 group-hover:opacity-100 w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-all"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">제품 등록</h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: "brand", label: "브랜드", placeholder: "Nike" },
                { key: "name", label: "제품명", placeholder: "에어포스 1 로우" },
                { key: "category", label: "카테고리", placeholder: "SHOES" },
                { key: "thumbnailUrl", label: "썸네일 URL", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-surface-2 border border-border rounded-2xl px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              ))}

              {form.thumbnailUrl && (
                <div className="w-full h-32 rounded-2xl bg-surface-2 border border-border overflow-hidden flex items-center justify-center">
                  <img
                    src={form.thumbnailUrl}
                    alt="미리보기"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "sizeMin", label: "최소" },
                  { key: "sizeMax", label: "최대" },
                  { key: "sizeStep", label: "단위" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={form[key as keyof typeof form] as number}
                      onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                      className="w-full bg-surface-2 border border-border rounded-2xl px-3 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreate}
                disabled={!form.name || !form.brand}
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-2xl font-semibold transition-all"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}