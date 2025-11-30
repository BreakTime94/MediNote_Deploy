import React, {useEffect, useState} from "react";
import TermsModal from "./TermsModal.jsx";
import api from "@/components/common/api/axiosInterceptor.js";

export default function TermsSection({ agreements, setAgreements, onTermsLoaded }) {
  const [termsList, setTermsList] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null); // 현재 선택된 약관

  useEffect(() => {
    api.get("/terms/list")
        .then((resp) => {
          console.log("Terms 가져오기 성공",resp.data.status)
          setTermsList(resp.data.list);
          onTermsLoaded(resp.data.list);
        })
        .catch((errors) => {
          console.log(errors.response.data);
        })
  }, []);

  const handleClickTerms = (terms) => {
    setSelectedTerm(terms); // 클릭 시 해당 약관 정보 모달로 전달
  };

  const handleCloseModal = () => {
    setSelectedTerm(null);
  };

  // 약관 동의 처리
  const handleConfirm = (policyCode) => {
    setAgreements({
      ...agreements,
      [policyCode]: true
    });
    handleCloseModal();
  };

  return (
      <div className="mt-6 border-t pt-2">
        <h3 className="font-semibold text-gray-800 mb-2">약관 동의</h3>

        <div className="space-y-2">
          {termsList.map((terms) => (
              <div
                  key={terms.policyCode}
                  className="flex items-center justify-between border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => handleClickTerms(terms)}
              >
                <div className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={agreements[terms.policyCode] || false}
                      onChange={(e) => setAgreements({
                        ...agreements,
                        [terms.policyCode]: e.target.checked
                      })}
                      onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 모달 안 뜨게
                  />
                  <span className="text-sm text-gray-800">
                {terms.title}{" "}
                    <span className="text-gray-500 text-xs">
                  ({terms.required ? "필수" : "선택"})
                    </span>
                  </span>
                </div>
              </div>
          ))}
        </div>

        {selectedTerm && (
            <TermsModal
                policyCode={selectedTerm.policyCode}
                title={selectedTerm.title}
                content={selectedTerm.content}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
            />
        )}
      </div>
  );
}
