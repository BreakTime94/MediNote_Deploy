import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Moon, Droplet, Heart } from "lucide-react";

export default function SummarySectionPreview(props) {
  const navigate = useNavigate();

  return (
      <section className="max-w-7xl mx-auto py-12 px-4 space-y-8 relative">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-tight">
          Health Dashboard
        </h2>

        {/* 블러 처리된 대시보드 */}
        <div className="relative">
          {/* 블러 효과 + 더미 UI */}
          <div className="blur-md pointer-events-none select-none">
            {/* 4개 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-md h-64 flex flex-col items-center justify-center">
                <Activity className="w-12 h-12 text-white/70 mb-4" />
                <div className="w-20 h-20 bg-white/50 rounded-full mb-4"></div>
                <div className="w-16 h-8 bg-white/50 rounded-lg"></div>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-6 rounded-2xl shadow-md h-64 flex flex-col items-center justify-center">
                <Droplet className="w-12 h-12 text-white/70 mb-4" />
                <div className="w-full h-32 bg-white/50 rounded-lg"></div>
              </div>
              <div className="bg-gradient-to-br from-violet-100 to-violet-200 p-6 rounded-2xl shadow-md h-64 flex flex-col items-center justify-center">
                <Moon className="w-12 h-12 text-white/70 mb-4" />
                <div className="w-full h-32 bg-white/50 rounded-lg"></div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-md h-64 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white/70" />
                <div className="w-32 h-32 border-8 border-white/50 rounded-full"></div>
              </div>
            </div>

            {/* 3개 트렌드 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm h-32"></div>
              <div className="bg-white p-4 rounded-xl shadow-sm h-32"></div>
              <div className="bg-white p-4 rounded-xl shadow-sm h-32"></div>
            </div>

            {/* 2개 팁 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl h-36"></div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl h-36"></div>
            </div>
          </div>

          {/* 로그인 유도 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border-2 border-purple-100">
              <div className="text-7xl mb-6 animate-pulse">🔒</div>
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
                로그인이 필요합니다
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                나만의 건강 대시보드를 확인하려면<br />
                로그인해주세요 ✨
              </p>
              <button
                  onClick={() => navigate('/member/login')}
                  className="w-full px-8 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                로그인하러 가기
              </button>
              <p className="text-sm text-gray-500 mt-4">
                계정이 없으신가요?{" "}
                <button
                    onClick={() => navigate('/member/register')}
                    className="text-purple-500 font-semibold hover:underline"
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}