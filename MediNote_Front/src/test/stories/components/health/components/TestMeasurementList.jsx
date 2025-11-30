import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axiosInterceptor.js";
import dayjs from "dayjs";

function TestMeasurementList(props) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect( () => {
    fetchMeasurements();
  }, []);

  //건강정보 리스트 api 호출
  const fetchMeasurements = async () => {
    try {
      const res = await api.get("/health/measurement/list");

      //응답이 배열일 때만
      setList(Array.isArray(res.data) ? res.data : []);
    }catch(err) {
      console.error("데이터 불러오기 실해 : ", err);
      setError("데이터 불러올 수 없습니다. 다시 시돗해주세요");
    }finally {
      setLoading(false);  //로딩 종료
    }
  };

  //수정 페이지로 이동
  const handleEdit = (id) => {
    navigate(`/health/measurement/${id}/edit`);
  };

  //삭제 처리
  const handleDelete = async (id) => {
    if(!window.confirm("삭제하시겠습니까?")) return;
    try{
      await api.delete(`/health/measurement/${id}`);
      alert("삭제 완료되었습니다.");

      setList((prev) => prev.filter((item) => item.id !== id));
    }catch (err) {
      console.error("삭제 실패 : ", err);
      alert("삭제 중 오류 발생하였습니다.");
    }
  };

  //상태별 색상 설정
  const  statusColor = (status) => {
    if(status === "ACTIVE") return "text-gray-600"; //활성화
    if(status === "INACTIVE") return "text-gray-400"; //비활성화
    return "text-gray-700"; //디폴트
  };

  //데이터 로딩중
  if(loading)
    return (<p className="text-gray-500 text-center mt-10">데이터 불러오는 중</p>);

  //에러
  if(error)
    return(<p className="text-red-500 text-center mt-10">{error}</p>);

  //데이터 없을 때
  if(list.length === 0)
    return(
      <div className="text-center text-gray-500 mt-10">
        <p>등록된 건강정보가 없습니다</p>
        <button
          onClick={() => navigate("/health/measurement/register")}
          className="mt-4 bg-pink-400 text-white px-2 py-2 rounded hover:bg-pink-500 transition">
          새 건강정보 등록하기!(등록 후 조회 가능)
        </button>
      </div>
    );

  //실제 목록 테이블 렌더링
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      {/* 제목 */}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
        내 건강정보 리스트
      </h1>

      {/*실제테이블*/}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-gray-700 text-sm">
            <th className="p-3 border border-gray-200">번호</th>
            <th className="p-3 border border-gray-200">측정일</th>
            <th className="p-3 border border-gray-200">혈압</th>
            <th className="p-3 border border-gray-200">혈당</th>
            <th className="p-3 border border-gray-200">수면</th>
            <th className="p-3 border border-gray-200">상태</th>
            <th className="p-3 border border-gray-200">관리</th>
          </tr>
        </thead>
        <tbody>
        {list.map((item, index) => (
          <tr
          key={item.id}
          className="text-center text-sm hover:bg-gray-50 transition">
            {/* 순번 */}
            <td className="p-2 border border-gray-200">{index + 1}</td>

            {/* 측정일 */}
            <td className="p-2 border border-gray-200">
              {item.measuredDate
                ? dayjs(item.measuredDate).format("YYYY-MM-DD HH:mm")
                : "-"}
            </td>

            {/* 혈압 */}
            <td className="p-2 border border-gray-200">
              {item.bloodPressureSystolic && item.bloodPressureDiastolic
                ? `${item.bloodPressureSystolic}/${item.bloodPressureDiastolic}`
                : "-"}
            </td>

            {/* 혈당 */}
            <td className="p-2 border border-gray-200">
              {item.bloodSugar || "-"}
            </td>

            {/* 수면시간 */}
            <td className="p-2 border border-gray-200">
              {item.sleepHours ? `${item.sleepHours}시간` : "-"}
            </td>

            {/* 상태 */}
            <td
              className={`p-2 border border-gray-200 font-semibold ${statusColor(
                item.status
              )}`}
            >
              {item.status}
            </td>

            {/* 수정 버튼 */}
            <td className="p-2 border border-gray-200 space-x-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="text-sm bg-purple-400 text-white px-3 py-1 rounded hover:bg-purple-500 transition">
                수정
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition">
                삭제
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/health/measurement/register")}
          className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 rounded-lg hover:opacity-90 transition duration-200">
          새 건강정보 등록하기
        </button>
      </div>
    </div>
  )
}

export default TestMeasurementList;