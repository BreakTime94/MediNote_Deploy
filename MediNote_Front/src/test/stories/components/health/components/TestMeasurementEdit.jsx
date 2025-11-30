import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./axiosInterceptor.js";
import dayjs from "dayjs";

function TestMeasurementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  //  데이터 불러오기
  useEffect(() => {
    fetchMeasurement();
  }, [id]);

  const fetchMeasurement = async () => {
    try {
      const res = await api.get(`/health/measurement/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      alert("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 공통 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 새 이력 저장
  const handleSaveNewVersion = async () => {
    if (!window.confirm("수정하시겠습니까?\n새 이력으로 저장됩니다.")) return;

    const payload = {
      gender: form.gender,
      smoking: form.smoking,
      drinking: form.drinking,
      drinkingPerWeek: form.drinkingPerWeek,
      drinkingPerOnce: form.drinkingPerOnce,
      chronicDiseaseYn: form.chronicDiseaseYn,
      allergyYn: form.allergyYn,
      medicationYn: form.medicationYn,
      height: form.height,
      weight: form.weight,
      bloodPressureSystolic: form.bloodPressureSystolic,
      bloodPressureDiastolic: form.bloodPressureDiastolic,
      bloodSugar: form.bloodSugar,
      sleepHours: form.sleepHours,
    };

    try {
      await api.put(`/health/measurement/update`, payload);
      alert("새로운 건강정보가 추가되었습니다.");
      navigate("/health/measurement/list");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 비활성화 (삭제)
  const handleDeactivate = async () => {
    if (!window.confirm("이 건강정보를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/health/measurement/${id}`);
      alert("해당 건강정보가 삭제(비활성화)되었습니다.");
      navigate("/health/measurement/list");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10">데이터 불러오는 중...</p>
    );

  if (!form)
    return (
      <p className="text-gray-500 text-center mt-10">
        데이터가 존재하지 않습니다.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      {/* 제목 */}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8 sticky top-0 py-2">
        건강정보 수정 / 삭제
      </h1>

      {/* 폼 */}
      <div className="space-y-6">
        {/* 성별 */}
        <div>
          <label className="font-semibold text-gray-700">성별</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
          >
            <option value="">선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        {/* 흡연 */}
        <div>
          <label className="font-semibold text-gray-700">흡연 여부</label>
          <select
            name="smoking"
            value={String(form.smoking)}
            onChange={(e) =>
              setForm({ ...form, smoking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </div>

        {/* 음주 */}
        <div>
          <label className="font-semibold text-gray-700">음주 여부</label>
          <select
            name="drinking"
            value={String(form.drinking)}
            onChange={(e) =>
              setForm({ ...form, drinking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </div>

        {/* 음주 상세 */}
        {form.drinking && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">주당 음주 횟수</label>
              <input
                type="number"
                name="drinkingPerWeek"
                value={form.drinkingPerWeek || ""}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">1회 음주량</label>
              <input
                type="number"
                name="drinkingPerOnce"
                value={form.drinkingPerOnce || ""}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        )}

        {/* 신체 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700">키 (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">체중 (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* 혈압 / 혈당 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-700">수축기 혈압</label>
            <input
              type="number"
              name="bloodPressureSystolic"
              value={form.bloodPressureSystolic || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">이완기 혈압</label>
            <input
              type="number"
              name="bloodPressureDiastolic"
              value={form.bloodPressureDiastolic || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">혈당</label>
            <input
              type="number"
              name="bloodSugar"
              value={form.bloodSugar || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* 수면 */}
        <div>
          <label className="font-semibold text-gray-700">수면 시간</label>
          <input
            type="number"
            name="sleepHours"
            value={form.sleepHours || ""}
            onChange={handleChange}
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* 측정일 */}
        <div>
          <label className="font-semibold text-gray-700">측정일</label>
          <p className="mt-2 w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600">
            {form.measuredDate
              ? dayjs(form.measuredDate).format("YYYY-MM-DD HH:mm")
              : "-"}
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={handleSaveNewVersion}
          className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-500 hover:opacity-90 transition"
        >
          수정(새 이력 저장)
        </button>
        <button
          onClick={handleDeactivate}
          className="px-6 py-2 rounded-lg font-semibold text-red-500 border border-red-300 hover:bg-red-50 transition"
        >
          삭제(비활성화)
        </button>
      </div>
    </div>
  );
}

export default TestMeasurementEdit;
