import SiteLayout from "../components/common/layout/SiteLayout.jsx";

export default function IndexPage() {
    return (
        <SiteLayout>
            <h2 className="text-2xl font-bold">홈 인덱스</h2>
            <p className="text-gray-600 mt-2">레이아웃 임시 데이터로 렌더링 확인</p>
        </SiteLayout>
    );
}