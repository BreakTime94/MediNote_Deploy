import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import api from "./axiosInterceptor.js"; // ✅ axios 인터셉터 import

// ✅ 하루 중 가장 최신 데이터만 남기기
const latestByDate = (list) => {
  const grouped = {};
  list.forEach((item) => {
    const date = dayjs(item.measuredDate).format("YYYY-MM-DD");
    if (!grouped[date] || dayjs(item.measuredDate).isAfter(grouped[date].measuredDate)) {
      grouped[date] = item;
    }
  });

  return Object.entries(grouped)
    .map(([date, item]) => ({ ...item, date }))
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
};

function TestMeasurementChart() {
  const [period, setPeriod] = useState("week"); // ✅ 기본값: 1주일
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 기간이 바뀔 때마다 차트 데이터 재조회
  useEffect(() => {
    fetchChartData();
  }, [period]);

  // ✅ 백엔드에서 기간별 차트 데이터 불러오기
  const fetchChartData = async () => {
    try {
      setLoading(true);

      // ✅ 선택한 기간(period)에 맞게 API 요청
      //    백엔드: /health/measurement/chart?period=week|month|quarter|half|year
      const res = await api.get(`/health/measurement/chart?period=${period}`);

      // ✅ 하루 중 최신 데이터만 남기기
      const dailyData = latestByDate(res.data);
      setChartData(dailyData);
    } catch (err) {
      console.error("📉 차트 불러오기 실패 :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-6">
        건강정보 차트
      </h1>

      {/* ✅ 기간 선택 버튼 */}
      <div className="flex justify-center space-x-3 mb-6">
        {[
          { label: "1주일", value: "week" },
          { label: "1개월", value: "month" },
          { label: "3개월(분기)", value: "quarter" },
          { label: "6개월(반기)", value: "half" },
          { label: "1년", value: "year" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setPeriod(btn.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
              ${
              period === btn.value
                ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ✅ 로딩 표시 */}
      {loading && (
        <p className="text-center text-gray-400 mb-4">📊 데이터를 불러오는 중...</p>
      )}

      {/* ✅ 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(data) => dayjs(data).format("MM/DD")}
            stroke="#888"
          />
          <YAxis stroke="#888" />
          <Tooltip
            formatter={(value, name) => [`${value}`, name]}
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Legend verticalAlign="top" height={36} />

          {/* ✅ 수치형 데이터 라인들 */}
          <Line type="monotone" dataKey="height" name="키(cm)" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="weight" name="체중(kg)" stroke="#EC4899" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodPressureSystolic" name="혈압(수축)" stroke="#F59E0B" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodPressureDiastolic" name="혈압(이완)" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodSugar" name="혈당(mg/dL)" stroke="#6366F1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sleepHours" name="수면(시간)" stroke="#14B8A6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* ✅ 데이터 없음 표시 */}
      {!loading && chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-6">선택된 기간에 데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default TestMeasurementChart;
