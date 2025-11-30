import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import { MeasurementValidation } from "./MeasurementValidation.jsx";
import { useconditionSearch } from "@/pages/health/useconditionSearch.jsx";
import {calculatePreviewScore, getScoreGrade} from "./healthScoreCalculator.js";

const initialHealthForm = {
  gender: "",
  smoking: false,
  drinking: false,
  drinkingPerWeek: "",
  drinkingPerOnce: "",
  drinkingType: "",
  drinkingUnit: "",
  chronicDiseaseYn: false,
  chronicDiseaseIds: [],
  allergyYn: false,
  allergyIds: [],
  medicationYn: false,
  medicationIds: [],
  medications: [],
  searchKeyword: "",
  height: "",
  weight: "",
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  bloodSugar: "",
  sleepHours: "",
  birthDate: "",
  age: "",
  ageGroup: "",
};

function Measurement() {
  const [form, setForm] = useState(initialHealthForm);
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [medicationSearch, setMedicationSearch] = useState("");
  const [medicationResults, setMedicationResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const searchTimer = useRef(null);
  const navigate = useNavigate();

  //실시간 점수 계산
  const [previewScore, setPreviewScore] = useState(0);
  const [scoreGrade, setScoreGrade] = useState({ grade: '-', text: '-', color: '#gray' });

  // 공통 검색 훅 (질환 / 알러지용)
  const chronicSearchHook = useconditionSearch(chronicOptions);
  const allergySearchHook = useconditionSearch(allergyOptions);

  //  나이 계산 함수
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  //  연령대 계산 함수
  const getAgeGroup = (age) => {
    if (!age) return "";
    if (age < 10) return "10세 미만";
    if (age < 20) return "10대";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    if (age < 70) return "60대";
    return "70대 이상";
  };

  //form이 변경될 때마다 점수 재계산
  useEffect(() => {
    const score = calculatePreviewScore(form);
    const grade = getScoreGrade(score);
    setPreviewScore(score);
    setScoreGrade(grade);
  }, [form]);

  //  음주 여부가 false일 때 세부 필드 초기화
  useEffect(() => {
    if (!form.drinking) {
      setForm((prev) => ({
        ...prev,
        drinkingType: "",
        drinkingUnit: "",
        drinkingPerWeek: "",
        drinkingPerOnce: "",
      }));
    }
  }, [form.drinking]);

  //  주종 선택 시 단위 자동 지정
  useEffect(() => {
    switch (form.drinkingType) {
      case "SOJU":
      case "WINE":
      case "WHISKY":
      case "COCKTAIL":
        setForm((p) => ({ ...p, drinkingUnit: "잔" }));
        break;
      case "BEER":
        setForm((p) => ({ ...p, drinkingUnit: "캔" }));
        break;
      case "MAKGEOLLI":
        setForm((p) => ({ ...p, drinkingUnit: "컵" }));
        break;
      default:
        setForm((p) => ({ ...p, drinkingUnit: "" }));
    }
  }, [form.drinkingType]);

  //  질환 / 알러지 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chronicRes, allergyRes] = await Promise.all([
          api.get("/health/condition/chronicDiseases"),
          api.get("/health/condition/allergies"),
        ]);
        setChronicOptions(chronicRes.data || []);
        setAllergyOptions(allergyRes.data || []);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchData();
  }, []);

  //  공통 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // 생년월일 입력 시 나이/연령대 자동 계산
    if (name === "birthDate") {
      const newAge = calculateAge(value);
      const newGroup = getAgeGroup(newAge);
      updatedForm.age = newAge;
      updatedForm.ageGroup = newGroup;
    }

    setForm(updatedForm);
    setErrors(MeasurementValidation(updatedForm));
  };

  //  복용약 검색 (디바운스 적용)
  const handleSearchMedication = async (keyword) => {
    if (!keyword.trim()) {
      setMedicationResults([]);
      return;
    }
    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(async () => {
      try {
        const res = await api.get(`/health/medication/search?keyword=${keyword}`);
        setMedicationResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("약품 검색 실패:", err);
      }
    }, 300);
  };

  //  복용약 선택
  const handleSelectMedication = (med) => {
    if (form.medications.some((m) => m.id === med.id)) return;
    setForm((prev) => ({
      ...prev,
      medications: [...prev.medications, med],
    }));
  };

  //  복용약 삭제
  const handleRemoveMedication = (id) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id),
    }));
  };

  //  기저질환 선택
  const handleSelectChronic = (opt) => {
    if (form.chronicDiseaseIds.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      chronicDiseaseIds: [...prev.chronicDiseaseIds, opt.id],
    }));
    chronicSearchHook.reset();
  };

  //  알러지 선택
  const handleSelectAllergy = (opt) => {
    if (form.allergyIds.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      allergyIds: [...prev.allergyIds, opt.id],
    }));
    allergySearchHook.reset();
  };

  //  저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = MeasurementValidation(form);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors)[0]);
      return;
    }

    if (!window.confirm("건강정보를 등록하시겠습니까?")) return;
    setIsLoading(true);

    const payload = {
      gender: form.gender,
      smoking: form.smoking,
      drinking: form.drinking,
      drinkingPerWeek: form.drinkingPerWeek,
      drinkingPerOnce: form.drinkingPerOnce,
      drinkingType: form.drinkingType,
      drinkingUnit: form.drinkingUnit,
      chronicDiseaseYn: form.chronicDiseaseYn,
      chronicDiseaseIds: form.chronicDiseaseIds,
      allergyYn: form.allergyYn,
      allergyIds: form.allergyIds,
      medicationYn: form.medicationYn,
      medicationIds: form.medications?.map((m) => m.id) || [],
      height: form.height,
      weight: form.weight,
      bloodPressureSystolic: form.bloodPressureSystolic,
      bloodPressureDiastolic: form.bloodPressureDiastolic,
      bloodSugar: form.bloodSugar,
      sleepHours: form.sleepHours,
      birthDate: form.birthDate,
    };

    try {
      await api.post("/health/measurement", payload);
      alert("건강정보가 등록되었습니다!");
      navigate("/mycare/list");
      setForm(initialHealthForm);
      setMedicationSearch("");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
        건강정보 등록
      </h1>

      {/* 🔥 실시간 건강점수 프리뷰 */}
      <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1 font-semibold">예상 건강점수</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold" style={{ color: scoreGrade.color }}>
                {previewScore}
              </span>
              <span className="text-xl text-gray-500 mb-2">점</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: scoreGrade.color }}
            >
              {scoreGrade.grade}
            </div>
            <div className="text-sm text-gray-600 font-semibold">{scoreGrade.text}</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-base">💡</span>
            <span>입력값이 변경되면 실시간으로 점수가 업데이트됩니다</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/*  생년월일 */}
          <div>
            <label className="font-semibold">생년월일</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2"
            />
            {(form.age || form.ageGroup) && (
              <p className="text-gray-600 text-sm mt-1">
                나이: <span className="font-medium">{form.age || "-"}</span>세 / 연령대:{" "}
                <span className="font-medium">{form.ageGroup || "-"}</span>
              </p>
            )}
          </div>

          {/*  성별 */}
          <div>
            <label className="font-semibold">성별</label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              required
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="">선택</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {/*  흡연 여부 */}
          <div>
            <label className="font-semibold">흡연 여부</label>
            <select
              name="smoking"
              value={String(form.smoking)}
              onChange={(e) => setForm({ ...form, smoking: e.target.value === "true" })}
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="false">아니오</option>
              <option value="true">예</option>
            </select>
          </div>

          {/*  음주 여부 */}
          <div>
            <label className="font-semibold">음주 여부</label>
            <select
              name="drinking"
              value={String(form.drinking)}
              onChange={(e) => setForm({ ...form, drinking: e.target.value === "true" })}
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="false">아니오</option>
              <option value="true">예</option>
            </select>
          </div>

          {/*  음주 상세 */}
          {form.drinking && (
            <div className="space-y-4 mt-3">
              <div>
                <label className="font-semibold">주종 선택</label>
                <select
                  name="drinkingType"
                  value={form.drinkingType}
                  onChange={(e) => setForm({ ...form, drinkingType: e.target.value })}
                  className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="">선택</option>
                  <option value="SOJU">소주</option>
                  <option value="BEER">맥주</option>
                  <option value="WINE">와인</option>
                  <option value="WHISKY">위스키</option>
                  <option value="MAKGEOLLI">막걸리</option>
                  <option value="COCKTAIL">칵테일</option>
                  <option value="ETC">기타</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold">주당 음주 횟수</label>
                  <input
                    type="number"
                    name="drinkingPerWeek"
                    value={form.drinkingPerWeek || ""}
                    onChange={handleChange}
                    placeholder="회"
                    step="1"
                    min="0"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    1회당 음주량 ({form.drinkingUnit || "잔"})
                  </label>
                  <input
                    type="number"
                    name="drinkingPerOnce"
                    value={form.drinkingPerOnce || ""}
                    onChange={handleChange}
                    placeholder={
                      form.drinkingType === "BEER"
                        ? "예: 3캔 (500ml)"
                        : form.drinkingType === "SOJU"
                          ? "예: 반병~1병"
                          : form.drinkingType === "WINE"
                            ? "예: 2잔"
                            : form.drinkingType === "WHISKY"
                              ? "예: 1잔"
                              : form.drinkingType === "MAKGEOLLI"
                                ? "예: 2컵"
                                : form.drinkingType === "COCKTAIL"
                                  ? "예: 2잔"
                                  : "예: 1회당 음주량 입력"
                    }
                    step="1"
                    min="0"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>
          )}


          {/*  기저질환 여부 */}
          <div>
            <label className="font-semibold">기저질환 여부</label>
            <select
              name="chronicDiseaseYn"
              value={String(form.chronicDiseaseYn)}
              onChange={(e) =>
                setForm({ ...form, chronicDiseaseYn: e.target.value === "true" })
              }
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="false">아니오</option>
              <option value="true">예</option>
            </select>

            {form.chronicDiseaseYn && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="기저질환 검색"
                  value={chronicSearchHook.keyword}
                  onChange={(e) => chronicSearchHook.handleSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full"
                />
                {chronicSearchHook.results.length > 0 && (
                  <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                    {chronicSearchHook.results.map((opt) => (
                      <li
                        key={opt.id}
                        className="cursor-pointer hover:text-pink-600 py-1"
                        onClick={() => handleSelectChronic(opt)}
                      >
                        + {opt.nameKo}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.chronicDiseaseIds.map((id) => {
                    const item = chronicOptions.find((c) => c.id === id);
                    return (
                      <span
                        key={id}
                        className="bg-blue-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                      >
                        {item?.nameKo}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              chronicDiseaseIds: prev.chronicDiseaseIds.filter(
                                (x) => x !== id
                              ),
                            }))
                          }
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/*  알러지 여부 */}
          <div>
            <label className="font-semibold">알러지 여부</label>
            <select
              name="allergyYn"
              value={String(form.allergyYn)}
              onChange={(e) =>
                setForm({ ...form, allergyYn: e.target.value === "true" })
              }
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="false">아니오</option>
              <option value="true">예</option>
            </select>

            {form.allergyYn && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="알러지 검색"
                  value={allergySearchHook.keyword}
                  onChange={(e) => allergySearchHook.handleSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full"
                />
                {allergySearchHook.results.length > 0 && (
                  <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                    {allergySearchHook.results.map((opt) => (
                      <li
                        key={opt.id}
                        className="cursor-pointer hover:text-pink-600 py-1"
                        onClick={() => handleSelectAllergy(opt)}
                      >
                        + {opt.nameKo}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.allergyIds.map((id) => {
                    const item = allergyOptions.find((a) => a.id === id);
                    return (
                      <span
                        key={id}
                        className="bg-green-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                      >
                        {item?.nameKo}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              allergyIds: prev.allergyIds.filter((x) => x !== id),
                            }))
                          }
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/*  복용약 여부 */}
          <div>
            <label className="font-semibold">복용약 여부</label>
            <select
              name="medicationYn"
              value={String(form.medicationYn)}
              onChange={(e) =>
                setForm({ ...form, medicationYn: e.target.value === "true" })
              }
              className="mt-2 w-full border rounded-lg px-3 py-2"
            >
              <option value="false">아니오</option>
              <option value="true">예</option>
            </select>

            {form.medicationYn && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="복용약 검색"
                  value={medicationSearch}
                  onChange={(e) => {
                    setMedicationSearch(e.target.value);
                    handleSearchMedication(e.target.value);
                  }}
                  className="border rounded-lg px-3 py-2 w-full"
                />

                {medicationSearch.length > 0 && medicationResults.length > 0 && (
                  <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                    {medicationResults.map((med) => (
                      <li
                        key={med.id}
                        className="cursor-pointer hover:text-pink-600 py-1"
                        onClick={() => handleSelectMedication(med)}
                      >
                        + {med.nameKo} {med.company && `(${med.company})`}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {form.medications.map((m) => (
                    <span
                      key={m.id}
                      className="bg-purple-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                    >
                      {m.nameKo}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(m.id)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/*  신체정보 입력 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">키 (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height || ""}
                onChange={handleChange}
                placeholder="예: 165"
                step="1"
                min="0"
                max="300"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-1">{errors.height}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">체중 (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight || ""}
                onChange={handleChange}
                placeholder="예: 60"
                step="1"
                min="0"
                max="500"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
            </div>
          </div>

          {/*  혈압 / 혈당 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold">수축기 혈압(mmHg)</label>
              <input
                type="number"
                name="bloodPressureSystolic"
                value={form.bloodPressureSystolic || ""}
                onChange={handleChange}
                placeholder="예: 120"
                step="1"
                min="0"
                max="300"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.bloodPressureSystolic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bloodPressureSystolic}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold">이완기 혈압(mmHg)</label>
              <input
                type="number"
                name="bloodPressureDiastolic"
                value={form.bloodPressureDiastolic || ""}
                onChange={handleChange}
                placeholder="예: 80"
                step="1"
                min="0"
                max="200"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.bloodPressureDiastolic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bloodPressureDiastolic}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold">혈당 (mg/dL)</label>
              <input
                type="number"
                name="bloodSugar"
                value={form.bloodSugar || ""}
                onChange={handleChange}
                placeholder="예: 90"
                step="1"
                min="0"
                max="600"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.bloodSugar && (
                <p className="text-red-500 text-sm mt-1">{errors.bloodSugar}</p>
              )}
            </div>
          </div>

          {/*  수면시간 */}
          <div>
            <label className="block font-semibold">수면 시간 (시간)</label>
            <input
              type="number"
              name="sleepHours"
              value={form.sleepHours || ""}
              onChange={handleChange}
              placeholder="예: 7"
              step="0.5"
              min="0"
              max="24"
              className="border rounded-lg px-3 py-2 w-full"
            />
            {errors.sleepHours && (
              <p className="text-red-500 text-sm mt-1">{errors.sleepHours}</p>
            )}
          </div>
        </div>

        {/*  등록 버튼 */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-500 hover:opacity-90 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Measurement;