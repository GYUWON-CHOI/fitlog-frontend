"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { itemApi, productApi, authApi } from "@/lib/api";

interface Item {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  size: number;
  fit: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sizeMin: number;
  sizeMax: number;
  sizeStep: number;
}

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [nickname, setNickname] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedFit, setSelectedFit] = useState("PERFECT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
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
      localStorage.removeItem("token");
          router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!selectedProductId || !selectedSize) return;
    try {
      await itemApi.addItem(selectedProductId, selectedSize, selectedFit);
      setShowAddForm(false);
      setSelectedProductId(null);
      setSelectedSize(null);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
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

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const sizeOptions = selectedProduct
    ? Array.from(
        { length: (selectedProduct.sizeMax - selectedProduct.sizeMin) / selectedProduct.sizeStep + 1 },
        (_, i) => selectedProduct.sizeMin + i * selectedProduct.sizeStep
      )
    : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FitLog</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{nickname}</span>
          <Link href="/recommendations" className="text-sm text-blue-600 hover:underline">
            추천 받기
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black">
            로그아웃
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">내 신발장</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
          >
            + 신발 추가
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl p-6 shadow mb-6">
            <h3 className="font-semibold mb-4">신발 추가</h3>
            <div className="flex flex-col gap-3">
              <select
                value={selectedProductId ?? ""}
                onChange={(e) => {
                  setSelectedProductId(Number(e.target.value));
                  setSelectedSize(null);
                }}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">제품 선택</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.name}
                  </option>
                ))}
              </select>

              {selectedProductId && (
                <select
                  value={selectedSize ?? ""}
                  onChange={(e) => setSelectedSize(Number(e.target.value))}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="">사이즈 선택</option>
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>{s}mm</option>
                  ))}
                </select>
              )}

              <select
                value={selectedFit}
                onChange={(e) => setSelectedFit(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="TIGHT">타이트</option>
                <option value="PERFECT">딱 맞음</option>
                <option value="LOOSE">여유있음</option>
              </select>

              <button
                onClick={handleAddItem}
                disabled={!selectedProductId || !selectedSize}
                className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                추가
              </button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow text-center text-gray-400">
            등록된 신발이 없어요. 신발을 추가해보세요!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl px-6 py-4 shadow flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">{item.brand} · {item.size}mm · {
                    item.fit === "TIGHT" ? "타이트" :
                    item.fit === "PERFECT" ? "딱 맞음" : "여유있음"
                  }</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}