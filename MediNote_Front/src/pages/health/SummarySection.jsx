import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
} from "recharts";
import { Activity, Moon, Droplet, Heart, TrendingUp, TrendingDown, Lightbulb, Target, HelpCircle, X, Award } from "lucide-react";

/* 산정 기준 모달 - 운동 제외, 재배분된 배점 */
/* 산정 기준 모달 - 최종 100점 배점 */
const ScoreCriteriaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6" />
            <h2 className="text-2xl font-bold">건강점수 산정 기준</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {/* 총점 안내 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl mb-6 border border-purple-200">
            <p className="text-center text-lg font-semibold text-gray-800">
              총 <span className="text-3xl text-purple-600 font-bold">100점</span> 만점
            </p>
          </div>

          {/* 항목별 배점 */}
          <div className="space-y-4 mb-6">
            <ScoreItem
              title="체중/BMI"
              points={18}
              color="#EC4899"
              description="연령대별 적정 BMI 범위 유지 시 만점"
              details={[
                "20~30대: BMI 18.5~24.9 (만점 18점)",
                "40~50대: BMI 18.5~25.9 (만점 18점)",
                "60대 이상: BMI 19~26.9 (만점 18점)",
                "※ 범위 벗어날수록 감점"
              ]}
            />

            <ScoreItem
              title="혈압"
              points={15}
              color="#F59E0B"
              description="수축기/이완기 혈압이 정상 범위일 때 만점"
              details={[
                "수축기 ≤120, 이완기 ≤80: 15점 (만점)",
                "수축기 121~130, 이완기 81~85: 11점",
                "수축기 131~140, 이완기 86~90: 7점",
                "수축기 >140 또는 이완기 >90: 4점"
              ]}
            />

            <ScoreItem
              title="혈당"
              points={15}
              color="#6366F1"
              description="공복 혈당이 정상 범위일 때 만점"
              details={[
                "70~100 mg/dL: 15점 (만점)",
                "101~125 mg/dL: 10점 (공복혈당장애)",
                "126~180 mg/dL: 5점 (당뇨 의심)",
                "70 미만 또는 180 초과: 3~8점"
              ]}
            />

            <ScoreItem
              title="수면"
              points={15}
              color="#14B8A6"
              description="연령대별 적정 수면 시간 유지 시 만점"
              details={[
                "성인(20~50대): 7~9시간 (만점 15점)",
                "노년층(60대 이상): 7~9시간 (만점 15점)",
                "5~7시간 미만 또는 9시간 초과: 9~10점",
                "5시간 미만: 5점"
              ]}
            />

            <ScoreItem
              title="흡연"
              points={12}
              color="#EF4444"
              description="비흡연자에게 만점 부여"
              details={[
                "비흡연: 12점 (만점)",
                "흡연: 0점"
              ]}
            />

            <ScoreItem
              title="음주"
              points={10}
              color="#F97316"
              description="음주 빈도와 음주량 기준"
              details={[
                "비음주: 10점 (만점)",
                "주당 총 음주량 ≤7잔: 10점",
                "주당 총 음주량 8~14잔: 7점",
                "주당 총 음주량 >14잔: 3점"
              ]}
            />

            <ScoreItem
              title="기저질환"
              points={8}
              color="#8B5CF6"
              description="만성질환 보유 개수에 따라 차등"
              details={[
                "없음: 8점 (만점)",
                "1개: 6점",
                "2개: 4점",
                "3개 이상: 2점"
              ]}
            />

            <ScoreItem
              title="알러지"
              points={4}
              color="#06B6D4"
              description="알러지 보유 개수에 따라 차등"
              details={[
                "없음: 4점 (만점)",
                "1개: 2점",
                "2개 이상: 1점"
              ]}
            />

            <ScoreItem
              title="복용약"
              points={3}
              color="#10B981"
              description="정기 복용약 개수에 따라 차등"
              details={[
                "없음: 3점 (만점)",
                "1~2개: 2점",
                "3개 이상: 1점"
              ]}
            />
          </div>

          {/* 등급 기준 */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              등급 기준
            </h3>
            <div className="space-y-2">
              <GradeItem grade="A+" range="90~100점" color="#10B981" label="매우 건강" />
              <GradeItem grade="A" range="80~89점" color="#22C55E" label="건강" />
              <GradeItem grade="B+" range="70~79점" color="#84CC16" label="양호" />
              <GradeItem grade="B" range="60~69점" color="#EAB308" label="보통" />
              <GradeItem grade="C+" range="50~59점" color="#F59E0B" label="주의" />
              <GradeItem grade="C" range="40~49점" color="#F97316" label="관리필요" />
              <GradeItem grade="D" range="40점 미만" color="#EF4444" label="위험" />
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <span className="font-semibold">건강점수는 참고용입니다.</span> 정확한 건강 상태는 의료 전문가와 상담하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 점수 항목 컴포넌트 */
const ScoreItem = ({ title, points, color, description, details }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
          {title}
        </h4>
        <span className="text-lg font-bold" style={{ color }}>{points}점</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="space-y-1">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 등급 항목 컴포넌트 */
const GradeItem = ({ grade, range, color, label }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <div
          className="px-3 py-1 rounded-full text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {grade}
        </div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-600">{range}</span>
    </div>
  );
};

/* 인덱스 페이지 건강 요약 섹션 - Premium Edition */
export default function SummarySection() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { member } = useAuthStore();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/health/measurement/summary", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      console.log("📊 summary response:", res.data);

      if (res.data && typeof res.data === "object") {
        setData(res.data);
      } else {
        console.warn("⚠️ 서버 응답 형식이 예상과 다름:", res.data);
        setData(null);
      }

    } catch (err) {
      console.error("❌ 요약 데이터 불러오기 실패:", err.response?.data || err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400">
        건강정보를 불러오는 중입니다...
      </div>
    );

  // 🔥 데이터 없을 때도 UI는 보여주기
  const isEmpty = !data || !data.weight;

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-600 text-center tracking-tight">
          Health Dashboard
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-purple-100 rounded-full transition group"
          title="건강점수 산정 기준 보기"
        >
          <HelpCircle className="w-6 h-6 text-purple-500 group-hover:text-purple-600" />
        </button>
      </div>

      {/* 산정 기준 모달 */}
      <ScoreCriteriaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 한 줄 4개 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <BMICard
          bmi={data?.bmi}
          status={data?.bmiStatus}
          height={data?.height}
          weight={data?.weight}
          isEmpty={isEmpty}
        />
        <BloodSugarChart
          bloodSugar={data?.bloodSugar}
          status={data?.bloodSugarStatus}
          isEmpty={isEmpty}
        />
        <SleepChart
          sleepHours={data?.sleepHours}
          status={data?.sleepStatus}
          isEmpty={isEmpty}
        />
        <HealthScoreChart
          score={data?.healthScore || 0}
          isEmpty={isEmpty}
        />
      </div>

      {/* 빈 데이터일 때 안내 메시지 */}
      {isEmpty && (
        <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl text-center border border-purple-100 shadow-sm">
          <div className="mb-4">
            <span className="text-6xl">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            건강정보를 등록해주세요
          </h3>
          <p className="text-gray-600 mb-6">
            건강 대시보드를 채우려면 첫 건강정보를 등록해야 해요!
          </p>
          <button
            onClick={() => navigate('/health/measurement')}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition shadow-lg"
          >
            건강정보 등록하러 가기 →
          </button>
        </div>
      )}

      {/* 데이터 있을 때만 트렌드 & 팁 표시 */}
      {!isEmpty && (
        <>
          {/* 주간 트렌드 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <TrendCard
              label="체중"
              value={`${data.weight || '-'}kg`}
              change={data.weightChange != null
                ? `${data.weightChange > 0 ? '+' : ''}${data.weightChange}kg`
                : "비교 데이터 없음"
              }
              trend={data.weightTrend || "stable"}
              emoji="⚖️"
            />
            <TrendCard
              label="혈당"
              value={`${data.bloodSugar || '-'} mg/dL`}
              change={data.bloodSugarChange != null
                ? `${data.bloodSugarChange > 0 ? '+' : ''}${data.bloodSugarChange}`
                : "비교 데이터 없음"
              }
              trend={data.bloodSugarTrend || "stable"}
              emoji="🩸"
            />
            <TrendCard
              label="수면"
              value={`${data.sleepHours || '-'}시간`}
              change={data.sleepHoursChange != null
                ? `${data.sleepHoursChange > 0 ? '+' : ''}${data.sleepHoursChange}시간`
                : "비교 데이터 없음"
              }
              trend={data.sleepTrend || "stable"}
              emoji="😴"
            />
          </div>

          {/* 건강 팁 & 목표 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">💡 오늘의 건강 팁</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getHealthTip(data)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">🎯 이번 주 목표</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    목표 체중 65kg 달성까지 <span className="font-bold text-blue-600">0.3kg</span> 남음!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">95% 달성</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl text-center shadow-sm border border-gray-100">
            <p className="text-base text-gray-700 font-medium leading-relaxed">
              {data.summary ?? "전반적으로 건강 상태가 안정적입니다 ✨"}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------------------------------------------
   주간 트렌드 카드
--------------------------------------------- */
function TrendCard({ label, value, change, trend, emoji }) {
  const trendConfig = {
    up: { icon: TrendingUp, color: "text-red-500", bg: "bg-red-50" },
    down: { icon: TrendingDown, color: "text-green-500", bg: "bg-green-50" },
    stable: { icon: null, color: "text-gray-500", bg: "bg-gray-50" }
  };

  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{emoji}</span>
        {TrendIcon && <TrendIcon className={`w-5 h-5 ${config.color}`} />}
      </div>
      <h3 className="text-sm text-gray-600 font-medium mb-1">{label}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className={`text-sm font-semibold ${config.color}`}>
          {change}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">vs 지난주</p>
    </div>
  );
}

/* ---------------------------------------------
   AI 건강 팁 생성
--------------------------------------------- */
function getHealthTip(data) {
  const tips = [];

  if (data.bloodSugar > 110) {
    tips.push("혈당이 약간 높아요. 식후 10분 산책을 추천드려요! 🚶‍♂️");
  }

  if (data.bmiStatus === "비만") {
    tips.push("규칙적인 운동과 균형잡힌 식단으로 건강한 체중을 유지해보세요 💪");
  }

  if (data.sleepHours < 7) {
    tips.push("수면 시간이 부족해요. 충분한 휴식이 건강의 기본이에요 😴");
  }

  if (tips.length === 0) {
    return "모든 지표가 안정적이에요! 이 상태를 계속 유지하세요 ✨";
  }

  return tips[0];
}

/* ---------------------------------------------
   BMI 카드 (빈 값 처리)
--------------------------------------------- */
function BMICard({ bmi, status, height, weight, isEmpty }) {
  const colorMap = {
    저체중: "#60a5fa",
    정상: "#34d399",
    과체중: "#fbbf24",
    비만: "#f87171",
  };
  const color = isEmpty ? "#D1D5DB" : (colorMap[status] || "#34d399");

  const minHealthyWeight = height
    ? (18.5 * ((height / 100) ** 2)).toFixed(1)
    : 53.5;
  const maxHealthyWeight = height
    ? (23 * ((height / 100) ** 2)).toFixed(1)
    : 66.5;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center justify-start h-full border border-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-5 h-5 ${isEmpty ? 'text-gray-300' : 'text-purple-400'}`} />
        <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
          현재 BMI
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center mb-4">
          <span className="text-7xl font-extrabold tracking-tight mb-3" style={{ color }}>
            {bmi ?? "-"}
          </span>
        <span
          className="text-sm font-bold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: color + "15", color }}
        >
            {status ?? "정보 없음"}
          </span>
      </div>

      <p className="text-sm text-gray-600 mb-2 font-medium">
        {isEmpty ? "등록된 정보 없음" : "건강한 상태"}
      </p>
      <p className="text-xs text-gray-400 leading-relaxed text-center">
        {isEmpty
          ? "건강정보를 등록해주세요"
          : `권장 체중: ${minHealthyWeight}kg - ${maxHealthyWeight}kg`
        }
      </p>
    </div>
  );
}

/* ---------------------------------------------
   혈당 차트 (빈 값 처리)
--------------------------------------------- */
function BloodSugarChart({ bloodSugar, status, isEmpty }) {
  const colorMap = {
    저혈당: "#fb923c",
    정상: "#34d399",
    공복혈당장애: "#fbbf24",
    "당뇨 의심": "#ef4444",
  };
  const color = isEmpty ? "#D1D5DB" : (colorMap[status] || "#34d399");

  const chartData = [
    { name: "현재", value: bloodSugar || 0 },
    { name: "정상", value: 90 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full border border-gray-50">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Droplet className={`w-5 h-5 ${isEmpty ? 'text-gray-300' : 'text-emerald-400'}`} />
        <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
          혈당 (mg/dL)
        </h3>
      </div>

      <div className="flex-1 flex items-center">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="bloodSugarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              domain={[50, 160]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <ReferenceArea y1={70} y2={110} fill="#FFF7D6" opacity={0.3} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill="url(#bloodSugarGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">현재:</span> {bloodSugar || '-'} /{" "}
          <span style={{ color }} className="font-medium">{status || '정보 없음'}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   수면 차트 (빈 값 처리)
--------------------------------------------- */
function SleepChart({ sleepHours, status, isEmpty }) {
  const colorMap = {
    "수면 부족": "#fb923c",
    "적정 수면": "#a78bfa",
    "수면 과다": "#fbbf24",
  };
  const color = isEmpty ? "#D1D5DB" : (colorMap[status] || "#a78bfa");

  const chartData = [
    { name: "현재", value: sleepHours || 0 },
    { name: "권장", value: 7 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full border border-gray-50">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Moon className={`w-5 h-5 ${isEmpty ? 'text-gray-300' : 'text-purple-400'}`} />
        <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
          수면 (시간)
        </h3>
      </div>

      <div className="flex-1 flex items-center">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              domain={[0, 12]}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar
              dataKey="value"
              fill="url(#sleepGradient)"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">현재:</span> {sleepHours || '-'}시간 /{" "}
          <span style={{ color }} className="font-medium">{status || '정보 없음'}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Health Score (빈 값 처리)
--------------------------------------------- */
function HealthScoreChart({ score, isEmpty }) {
  const getScoreColor = (score) => {
    if (isEmpty) return "#D1D5DB";
    if (score >= 80) return "#c084fc";
    if (score >= 60) return "#f9a8d4";
    return "#fb923c";
  };
  const color = getScoreColor(score);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center justify-start h-full border border-gray-50">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Heart className={`w-5 h-5 ${isEmpty ? 'text-gray-300' : 'text-blue-400'}`} />
        <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
          Health Score
        </h3>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center"
           style={{ filter: `drop-shadow(0 4px 12px ${color}30)` }}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform -rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#f3f4f6"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-end">
              <span className="text-5xl font-extrabold leading-none tracking-tight" style={{ color }}>
                {isEmpty ? "-" : score}
              </span>
            {!isEmpty && <span className="text-sm text-gray-400 mb-2 ml-1 font-medium">점</span>}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 font-medium">
        {isEmpty ? "정보 없음" : "100점 만점 기준"}
      </p>
    </div>
  );
}