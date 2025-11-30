// components/common/modal/BaseModal.jsx
import React from "react";

export default function BaseModal({ title, onClose, children, width = "w-[500px]" }) {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div
            className={`bg-white rounded-2xl shadow-lg p-6 ${width} max-h-[80vh] overflow-y-auto relative`}
        >
          {/* 닫기 버튼 */}
          <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>

          {/* 제목 */}
          {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

          {/* 본문 */}
          <div className="text-gray-800">{children}</div>
        </div>
      </div>
  );
}
