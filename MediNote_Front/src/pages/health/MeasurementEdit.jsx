import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import dayjs from "dayjs";
import {MeasurementValidation} from "./MeasurementValidation.jsx";
import {useconditionSearch} from "@/pages/health/useconditionSearch.jsx";
import {calculatePreviewScore, getScoreGrade} from "./healthScoreCalculator.js";  // 🔥 추가

function MeasurementEdit({ id, onMypage }) {
  const navigate = useNavigate();
  const params = useParams();
  const [memberId, setMemberId] = useState(id);
  const [errors, setErrors] = useState({});

  // 🔥 실시간 점수 계산 추가
  const [previewScore, setPreviewScore] = useState(0);
  const [scoreGrade, setScoreGrade] = useState({ grade: '-', text: '-', color: '#gray' });

  useEffect(() => {
    if (memberId === null || memberId === undefined) {
      setMemberId(params.id);
    }
  }, [params.id, id]);

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // 검색 관련 상태
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [medicationSearch, setMedicationSearch] = useState("");
  const [medicationResults, setMedicationResults] = useState([]);
  const searchTimer = useRef(null);

  //  키워드 검색 훅 적용
  const chronicSearchHook = useconditionSearch(chronicOptions);
  const allergySearchHook = useconditionSearch(allergyOptions);

  // 🔥 form이 변경될 때마다 점수 재계산
  useEffect(() => {
    if (form) {
      const score = calculatePreviewScore(form);
      const grade = getScoreGrade(score);
      setPreviewScore(score);
      setScoreGrade(grade);
    }
  }, [form]);

  // 등록폼과 동일하게 전체 리스트 1회 로딩
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
        console.error("질환/알러지 목록 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 멤버 데이터 불러오기
  useEffect(() => {
    if (!memberId) return;
    fetchMeasurement();
  }, [memberId]);

  const fetchMeasurement = async () => {
    try {
      const res = await api.get(`/health/measurement/latest`);

      const medications = (res.data.medicationIds || []).map((id, index) => ({
        id: id,
        nameKo: res.data.medicationNames?.[index] || "약품명 없음",
        company: "",
      }));

      setForm({
        ...res.data,
        chronicDiseaseIds: res.data.chronicDiseaseIds || [],
        allergyIds: res.data.allergyIds || [],
        medications: medications,
      });
      setLoading(false);
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      alert("데이터를 불러올 수 없습니다.");
      setLoading(false);
    }
  };

  // 공통 입력
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const newErrors = MeasurementValidation(updatedForm);
    setErrors(newErrors);
  };

  // 복용약 검색
  const handleSearchMedication = (keyword) => {
    if (!keyword.trim()) {
      setMedicationResults([]);
      return;
    }
    if(searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(async () => {
      try {
        const res = await api.get(`/health/medication/search?keyword=${keyword}`);
        setMedicationResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("약 검색 실패:", err);
      }
    }, 300);
  };

  // 복용약 선택
  const handleSelectMedication = (med) => {
    if (!form.medications) form.medications = [];

    if (form.medications.some((m) => m.id === med.medicationId)) return;

    const medication = {
      id: med.medicationId,
      nameKo: med.nameKo,
      company: med.company || "",
    };

    setForm((prev) => ({
      ...prev,
      medications: [...prev.medications, medication],
    }));
  };

  // 복용약 삭제
  const handleRemoveMedication = (id) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id),
    }));
  };

  //  기저질환 선택 (훅 사용)
  const handleSelectChronic = (opt) => {
    if (form.chronicDiseaseIds?.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      chronicDiseaseIds: [...(prev.chronicDiseaseIds || []), opt.id],
    }));
    chronicSearchHook.reset();
  };

  //  알러지 선택 (훅 사용)
  const handleSelectAllergy = (opt) => {
    if (form.allergyIds?.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      allergyIds: [...(prev.allergyIds || []), opt.id],
    }));
    allergySearchHook.reset();
  };

  // 저장
  const handleSaveNewVersion = async () => {
    const validationErrors = MeasurementValidation(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert(Object.values(validationErrors)[0]);
      return;
    }

    if (!window.confirm("수정하시겠습니까?\n새 이력으로 저장됩니다.")) return;

    const payload = {
      gender: form.gender,
      smoking: form.smoking,
      drinking: form.drinking,
      drinkingType: form.drinkingType,
      drinkingPerWeek: form.drinkingPerWeek,
      drinkingPerOnce: form.drinkingPerOnce,
      chronicDiseaseYn:
        form.chronicDiseaseYn === true || form.chronicDiseaseYn === "true",
      chronicDiseaseIds: form.chronicDiseaseIds || [],
      allergyYn:
        form.allergyYn === true || form.allergyYn === "true",
      allergyIds: form.allergyIds || [],
      medicationYn:
        form.medicationYn === true || form.medicationYn === "true",
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
      await api.put(`/health/measurement/update`, payload);
      alert("건강정보가 새 이력으로 저장되었습니다.");
      id ? onMypage() : navigate("/mycare/list");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading || !form)
    return (
      <p className="text-center mt-10 text-gray-500">데이터 불러오는 중...</p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
        건강정보 수정
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
            <span>수정 내용이 반영된 예상 점수입니다</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 생년월일 */}
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

        {/* 성별 */}
        <div>
          <label className="font-semibold">성별</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="">선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        {/* 흡연 */}
        <div>
          <label className="font-semibold">흡연 여부</label>
          <select
            name="smoking"
            value={String(form.smoking)}
            onChange={(e) =>
              setForm({ ...form, smoking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="false">아니오</option>
            <option value="true">예</option>
          </select>
        </div>

        {/* 음주 */}
        <div>
          <label className="font-semibold">음주 여부</label>
          <select
            name="drinking"
            value={String(form.drinking)}
            onChange={(e) =>
              setForm({ ...form, drinking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="false">아니오</option>
            <option value="true">예</option>
          </select>
        </div>

        {/* 음주 상세 */}
        {form.drinking && (
          <div className="space-y-4 mt-2">
            {/* 주종 선택 */}
            <div>
              <label className="font-semibold">주종 선택</label>
              <select
                name="drinkingType"
                value={form.drinkingType || ""}
                onChange={handleChange}
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

            {/* 주당 음주 횟수 / 1회 음주량 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold">주당 음주 횟수</label>
                <input
                  type="number"
                  name="drinkingPerWeek"
                  value={form.drinkingPerWeek || ""}
                  onChange={handleChange}
                  placeholder="회"
                  step="0.1"
                  min="0"
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold">
                  1회당 음주량 (단위 자동)
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
                  step="0.1"
                  min="0"
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/*  기저질환 (훅 적용) */}
        <div>
          <label className="font-semibold">기저질환 여부</label>
          <select
            name="chronicDiseaseYn"
            value={String(form.chronicDiseaseYn)}
            onChange={(e) =>
              setForm({
                ...form,
                chronicDiseaseYn: e.target.value === "true",
              })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="false">아니오</option>
            <option value="true">예</option>
          </select>

          {form.chronicDiseaseYn === true && (
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
                {form.chronicDiseaseIds?.map((id) => {
                  const item = chronicOptions.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="bg-blue-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                    >
                      {item?.nameKo}
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            chronicDiseaseIds:
                              prev.chronicDiseaseIds.filter((x) => x !== id),
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

        {/* 알러지 (훅 적용) */}
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

          {form.allergyYn === true && (
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
                {form.allergyIds?.map((id) => {
                  const item = allergyOptions.find((a) => a.id === id);
                  return (
                    <span
                      key={id}
                      className="bg-green-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                    >
                      {item?.nameKo}
                      <button
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            allergyIds: prev.allergyIds.filter(
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

        {/* 복용약 */}
        <div>
          <label className="font-semibold">복용약 여부</label>
          <select
            name="medicationYn"
            value={String(form.medicationYn)}
            onChange={(e) =>
              setForm({
                ...form,
                medicationYn: e.target.value === "true",
              })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2"
          >
            <option value="false">아니오</option>
            <option value="true">예</option>
          </select>

          {form.medicationYn === true && (
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

              {medicationSearch.length > 0 &&
                medicationResults.length > 0 && (
                  <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                    {medicationResults.map((med) => (
                      <li
                        key={med.medicationId}
                        className="cursor-pointer hover:text-pink-600 py-1"
                        onClick={() => handleSelectMedication(med)}
                      >
                        + {med.nameKo}{" "}
                        {med.company && `(${med.company})`}
                      </li>
                    ))}
                  </ul>
                )}

              <div className="mt-3 flex flex-wrap gap-2">
                {form.medications?.map((m) => (
                  <span
                    key={m.id}
                    className="bg-purple-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                  >
                    {m.nameKo}
                    <button
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

        {/* 신체정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              키 (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
              placeholder="169"
              step="0.1"
              min="0"
              max="300"
              className={`border rounded-lg px-3 py-2 w-full ${
                errors.height ? "border-red-400" : ""
              }`}
            />
            {errors.height && (
              <p className="text-red-500 text-sm mt-1">{errors.height}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              체중 (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
              placeholder="73"
              step="0.1"
              min="0"
              max="500"
              className={`border rounded-lg px-3 py-2 w-full ${
                errors.weight ? "border-red-400" : ""
              }`}
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>
        </div>

        {/* 혈압/혈당 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              수축기 혈압
            </label>
            <input
              type="number"
              name="bloodPressureSystolic"
              value={form.bloodPressureSystolic || ""}
              onChange={handleChange}
              placeholder="118"
              step="1"
              min="0"
              max="300"
              className={`border rounded-lg px-3 py-2 w-full ${
                errors.bloodPressureSystolic ? "border-red-400" : ""
              }`}
            />
            {errors.bloodPressureSystolic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bloodPressureSystolic}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              이완기 혈압
            </label>
            <input
              type="number"
              name="bloodPressureDiastolic"
              value={form.bloodPressureDiastolic || ""}
              onChange={handleChange}
              placeholder="81"
              step="1"
              min="0"
              max="200"
              className={`border rounded-lg px-3 py-2 w-full ${
                errors.bloodPressureDiastolic ? "border-red-400" : ""
              }`}
            />
            {errors.bloodPressureDiastolic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bloodPressureDiastolic}
              </p>
            )}
            {errors.bloodPressure && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bloodPressure}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              혈당 (mg/dL)
            </label>
            <input
              type="number"
              name="bloodSugar"
              value={form.bloodSugar || ""}
              onChange={handleChange}
              placeholder="90"
              step="1"
              min="0"
              max="600"
              className={`border rounded-lg px-3 py-2 w-full ${
                errors.bloodSugar ? "border-red-400" : ""
              }`}
            />
            {errors.bloodSugar && (
              <p className="text-red-500 text-sm mt-1">{errors.bloodSugar}</p>
            )}
          </div>
        </div>

        {/* 수면 */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            수면 시간 (시간)
          </label>
          <input
            type="number"
            name="sleepHours"
            value={form.sleepHours || ""}
            onChange={handleChange}
            placeholder="7"
            step="0.5"
            min="0"
            max="24"
            className={`border rounded-lg px-3 py-2 w-full ${
              errors.sleepHours ? "border-red-400" : ""
            }`}
          />
          {errors.sleepHours && (
            <p className="text-red-500 text-sm mt-1">{errors.sleepHours}</p>
          )}
        </div>

        {/* 측정일 */}
        <div>
          <label className="font-semibold text-gray-700">측정일</label>
          <p className="mt-2 border rounded-lg px-3 py-2 bg-gray-50">
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
      </div>
    </div>
  );
}

export default MeasurementEdit;