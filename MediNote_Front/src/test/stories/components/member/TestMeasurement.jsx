import React, {useState} from "react";
import api from "./axiosInterceptor.js";


function TestMeasurement(props) {
  const [form, setForm] = useState({
    memberId: "",
    gender: "",
    smoking: "",
    drinking: "",
    drinkingPerWeek: "",
    drinkingPerOnce: "",
    chronicDiseaseYn: "",
    chronicDiseaseDetail: "",
    allergyYn: "",
    allergyDetail: "",
    medicationYn: "",
    medicationDetail: "",
    height: "",
    weight: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: ""
  });

  const handleChange = e => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(form);
    api.post("/health/measurement/create", form, {
      withCredentials: true
    }).then((resp) => {
      console.log("Content-Type", resp.headers[`content-type`])
    }).catch((error) => {
      console.log("error", error);
    });
  };

  //타입이 boolean -> radio로 한 번에 처리
  const RadioYN = ({name, label}) => (<div className="flex flex-col mb-4">
    <span className="text-gray-700 font-semibold mb-1">{label}</span>
    <div className="flex space-x-4">
      <label className="flex items-center space-x-1">
        <input type="radio" name={name} value="Y" checked={form[name] === "Y"}
               onChange={handleChange} className="text-primary-500 focus:ring-primary-500"/>
        <span>Y</span>
      </label>
      <label className="flex items-center space-x-1">
        <input type="radio" name={name} value="N" checked={form[name] === "N"}
               onChange={handleChange} className="text-primary-500 focus:ring-primary-500"/>
        <span>N</span>
      </label>
    </div>
  </div>)
  return (<form
      onSubmit={handleSubmit}
      className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md space-y-6">

    <div className="flex flex-col">
      <label className="text-gray-700 font-semibold mb-1">성별 : </label>
      <select name="gender" value={form.gender} onChange={handleChange} required
              className="border border-gray-300 rounded-md p-2 focus:ring-purple-400">
        <option value="">선택</option>
        <option value="MALE">남성</option>
        <option value="FEMALE">여성</option>
        <option value="OTHER">그외</option>
      </select>
    </div>

    <RadioYN name="smoking" label="흡연 여부"/>

    <RadioYN name="drinking" label="음주 여부"/>
    {form.drinking === "Y" && (<div className="ml-4 space-y-3">
      <div className="flex flex-col">
        <label className="text-gray-800 mb-1">주당 음주 횟수</label>
        <input type="number" name="drinkingPerWeek" value={form.drinkingPerWeek} onChange={handleChange}
               className="border border-gray-300 rounded-md p-2 focus:ring-purple-400"/>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-800 mb-1">1회당 음주량</label>
        <input type="number" name="drinkingPerOnce" value={form.drinkingPerOnce}
               onChange={handleChange}
               className="border border-gray-300 rounded-md p-2 focus:ring-purple-400"/>
      </div>
    </div>)}

    <RadioYN name="chronicDiseaseYn" label="기저질환 여부"/>
    {form.chronicDiseaseYn === "Y" && (<div className="flex flex-col ml-4">
      <label className="text-gray-800 mb-1">기저질환명</label>
      <select name="chronicDiseaseDetail" value={form.chronicDiseaseDetail} onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-purple-400">
        <option value="">선택하세요</option>
        <option value="당뇨병">당뇨병</option>
        <option value="고혈압">고혈압</option>
        <option value="심장병">심장병</option>
        {/* mlist에서 가져올 데이터들 */}
      </select>
    </div>)}

    <RadioYN name="allergyYn" label="알러지 여부"/>
    {form.allergyYn === "Y" && (<div className="flex flex-col ml-4">
      <label className="text-gray-800 mb-1">알러지명</label>
      <select name="allergyDetail" value={form.allergyDetail} onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-purple-400">
        <option value="">선택하세요</option>
        <option value="당뇨병">당뇨병</option>
        <option value="고혈압">고혈압</option>
        <option value="심장병">심장병</option>
        {/* mlist에서 가져올 데이터들 */}
      </select>
    </div>)}

    <RadioYN name="medicationYn" label="복용약 여부"/>
    {form.medicationYn === "Y" && (<div className="flex flex-col ml-4">
      <label className="text-gray-800 mb-1">복용약명</label>
      <select name="allergyDetail" value={form.medicationDetail} onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-purple-400">
        <option value="">선택하세요</option>
        <option value="당뇨병">타이레놀</option>
        <option value="고혈압">아스피린</option>
        <option value="심장병">도파민</option>
        {/* mlist에서 가져올 데이터들 */}
      </select>
    </div>)}

    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-semibold mb-1">키 :</label>
        <input type="number" name="height" value={form.height} onChange={handleChange} min="0"
               className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"/>
        <span className="text-gray-700">cm</span>
      </div>
    </div>

    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-semibold mb-1">체중 :</label>
        <input type="number" name="weight" value={form.weight} onChange={handleChange} min="0"
               className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"/>
        <span className="text-gray-700">kg</span>
      </div>
    </div>
    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-semibold mb-1">혈압 :</label>
        <input type="number" name="bloodPressureSystolic" value={form.bloodPressureSystolic}
               onChange={handleChange}
               min="0" placeholder="수축기"
               className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"/>
        <span className="text-gray-700">mmHg</span>
        <div className="flex items-center space-x-2">
          <input type="number" name="bloodPressureDiastolic" value={form.bloodPressureDiastolic}
                 onChange={handleChange}
                 min="0" placeholder="이완기"
                 className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"/>
          <span className="text-gray-700">mmHg</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-semibold mb-1">혈당 : </label>
        <input type="number" name="bloodSugar" value={form.bloodSugar} onChange={handleChange}
               min="0" placeholder="예 : 90"
               className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"/>
        <span className="text-gray-700">mg/dL</span>
      </div>
    </div>
    <div className="flex justify-center">
      <button type="submit"
              className="flex items-center bg-pink-300 text-white px-12 py-2 rounded hover:bg-pink-400 active:bg-pink-500 cursor-pointer"> 저장
      </button>
    </div>
  </form>);
}

export default TestMeasurement;