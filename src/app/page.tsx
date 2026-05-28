import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">FitLog</h1>
      <p className="text-gray-500 mb-8">나와 같은 취향의 유저가 신는 사이즈를 추천해드려요</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
          로그인
        </Link>
        <Link href="/signup" className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100">
          회원가입
        </Link>
      </div>
    </main>
  );
}