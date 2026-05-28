const BASE_URL = "http://localhost:8080";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!data.success) throw new Error(data.message || "오류가 발생했습니다.");
  return data.data;
}

// 유저 API
export const authApi = {
  signup: (email: string, password: string, nickname: string) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, nickname }),
    }),

  login: async (email: string, password: string) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getMyInfo: () => request("/api/users/me"),
};

// 제품 API
export const productApi = {
  search: (keyword?: string, brand?: string, category?: string) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (brand) params.append("brand", brand);
    if (category) params.append("category", category);
    return request(`/api/products?${params.toString()}`);
  },

  getById: (id: number) => request(`/api/products/${id}`),
};

// 아이템 API
export const itemApi = {
  getMyItems: () => request("/api/items"),

  addItem: (productId: number, size: number, fit: string) =>
    request("/api/items", {
      method: "POST",
      body: JSON.stringify({ productId, size, fit }),
    }),

  deleteItem: (id: number) =>
    request(`/api/items/${id}`, { method: "DELETE" }),
};

// 추천 API
export const recommendationApi = {
  recommend: (productId: number) =>
    request(`/api/recommendations?productId=${productId}`),
};