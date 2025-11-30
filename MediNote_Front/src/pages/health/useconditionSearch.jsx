import {useState, useRef } from "react";

export function useconditionSearch(options) {
  //기저질환, 알러지 검색 훅
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const searchTimer = useRef(null);
  //디바운싱(성능 최적화시 필요)

  const handleSearch = (value) => {
    setKeyword(value);
    if(searchTimer.current) clearTimeout(searchTimer.current);

    //공백 제거 확인
    searchTimer.current = setTimeout(() => {
      const trimmed = value.trim();
      if(!trimmed) {
        setResults([]); //빈 입력값이면 초기화
        return;
      }

      //키워드 포함된 항목 필터링
      const filtered = options.filter(
          (opt) => opt.nameKo && opt.nameKo.includes(value)
      );
      setResults(filtered);
    }, 200);
  };

  //reset 초기화
  const reset = () => {
    setKeyword(""); //검색어 초기화
    setResults([]); //검색 결과 초기화
  };
  return {keyword, results, handleSearch, reset};
}
