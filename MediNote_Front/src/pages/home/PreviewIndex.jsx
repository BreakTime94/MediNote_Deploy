// components/health/HealthDashboardPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function previewIndex() {
  return (
      <div className="relative max-w-7xl mx-auto">  {/* 👈 max-w 추가해서 크기 제한 */}
        {/* 블러 처리된 대시보드 프리뷰 */}
        <div className="blur-md pointer-events-none select-none">  {/* blur-sm을 blur-md로 변경 */}
          <div className="bg-white p-6 rounded-lg">  {/* p-8을 p-6으로 축소 */}
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Health Dashboard</h1>  {/* 폰트 크기 축소 */}

            {/* 상단 4개 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">  {/* gap-6을 gap-4로 축소 */}
              {/* BMI 카드 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl shadow-sm">  {/* p-6을 p-4로 축소 */}
                <div className="text-xs text-gray-600 mb-1">💪 현재 BMI</div>
                <div className="text-4xl font-bold text-green-500 mb-1">20.7</div>  {/* text-5xl을 text-4xl로 축소 */}
                <div className="text-xs text-green-600 font-semibold">정상</div>
                <div className="text-xs text-gray-500 mt-1">권장치 18-25</div>
                <div className="text-xs text-gray-400">권장 체중: 52.8kg - 65.7kg</div>
              </div>

              {/* 혈당 카드 */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-sm">
                <div className="text-xs text-gray-600 mb-1">💧 혈당 (MG/DL)</div>
                <div className="h-24 flex items-end justify-center">  {/* h-32를 h-24로 축소 */}
                  <div className="w-full h-16 bg-gradient-to-t from-green-200 to-green-300 rounded"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">현재: 90 / 정상</div>
              </div>

              {/* 수면 카드 */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm">
                <div className="text-xs text-gray-600 mb-1">🌙 수면 (시간)</div>
                <div className="h-24 flex items-end gap-2">  {/* h-32를 h-24로 축소 */}
                  <div className="flex-1 bg-yellow-300 h-24 rounded"></div>
                  <div className="flex-1 bg-yellow-300 h-16 rounded"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">현재: 15시간 / 수면 과다</div>
              </div>

              {/* Health Score 카드 */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-sm">
                <div className="text-xs text-gray-600 mb-1">💙 HEALTH SCORE</div>
                <div className="flex items-center justify-center h-24">  {/* h-32를 h-24로 축소 */}
                  <div className="relative w-24 h-24">  {/* w-32 h-32를 w-24 h-24로 축소 */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="42" stroke="#e5e7eb" strokeWidth="8" fill="none" />  {/* 크기 조정 */}
                      <circle cx="48" cy="48" r="42" stroke="#8b5cf6" strokeWidth="8" fill="none"
                              strokeDasharray="264" strokeDashoffset="52" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">85점</span>  {/* text-3xl을 text-2xl로 축소 */}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">100점 만점 기준</div>
              </div>
            </div>

            {/* 하단 3개 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">  {/* gap-6을 gap-4로 축소 */}
              <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">  {/* p-6을 p-4로 축소 */}
                <div className="text-xl mb-1">⚖️</div>
                <div className="text-xs text-gray-600">체중</div>
                <div className="text-xl font-bold text-gray-800">59kg <span className="text-xs text-gray-500">0kg</span></div>
                <div className="text-xs text-gray-400">vs 지난주</div>
              </div>

              <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
                <div className="text-xl mb-1">🩸</div>
                <div className="text-xs text-gray-600">혈당</div>
                <div className="text-xl font-bold text-gray-800">90 mg/dL <span className="text-xs text-gray-500">0</span></div>
                <div className="text-xs text-gray-400">vs 지난주</div>
              </div>

              <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
                <div className="text-xl mb-1">😴</div>
                <div className="text-xs text-gray-600">수면</div>
                <div className="text-xl font-bold text-gray-800">15시간 <span className="text-xs text-red-500">+12시간</span></div>
                <div className="text-xs text-gray-400">vs 지난주</div>
              </div>
            </div>

            {/* 하단 알림 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  {/* gap-6을 gap-4로 축소 */}
              <div className="bg-purple-50 p-4 rounded-xl">  {/* p-6을 p-4로 축소 */}
                <div className="text-sm mb-1">💡 💪 오늘의 건강 팁</div>
                <div className="text-xs text-gray-600">모든 지표가 안정적이에요! 이 상태를 계속 유지하세요 ✨</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm mb-1">🎯 🎯 이번 주 목표</div>
                <div className="text-xs text-gray-600 mb-2">목표 체중 65kg 달성까지 <span className="font-bold text-blue-600">0.3kg</span> 남음!</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">95% 달성</div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 오버레이 - 로그인 안내 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">  {/* mx-4 추가 */}
            <div className="text-5xl mb-3">🔒</div>  {/* text-6xl을 text-5xl로 축소 */}
            <h2 className="text-2xl font-bold mb-3 text-gray-800">건강 관리를 시작하세요!</h2>  {/* text-3xl을 text-2xl로 축소 */}
            <p className="text-sm text-gray-600 mb-4">로그인하면 당신의 건강 정보를 한눈에 확인할 수 있어요</p>
            <Link
                to="/member/login"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              로그인하러 가기 →
            </Link>
          </div>
        </div>
      </div>
  );
}