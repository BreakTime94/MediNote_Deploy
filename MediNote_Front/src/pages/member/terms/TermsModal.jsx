import BaseModal from "@/components/common/modal/BaseModal.jsx";

export default function TermsModal({policyCode, title, content, onClose, onConfirm}) {

  return (
      <BaseModal title={title} onClose={onClose}>
        <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed mb-4">
          {content}
        </div>

        <button
            onClick={() => onConfirm(policyCode)} // 클릭 시 약관 코드 전달
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          약관에 동의합니다
        </button>
      </BaseModal>
  );
}
