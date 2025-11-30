import Profile from "@/pages/member/Profile.jsx";
import ChangePassword from "@/pages/member/ChangePassword.jsx";
import AsideNav from "@/components/common/nav/AsideNav.jsx";
import {useAsideNav} from "@/components/common/hooks/useAsideNav.jsx";
import MeasurementList from "@/pages/health/MeasurementList.jsx";
import MeasurementEdit from "@/pages/health/MeasurementEdit.jsx";
import React, {useMemo, useState} from "react";
import MeasurementChart from "@/pages/health/MeasurementChart.jsx";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

export default function MyPage() {
  const {member} = useAuthStore();
  const [editId, setEditId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const handleMypage = () => {
    setEditId(null);
    setSelectedData(null);
  }

  const navItems = useMemo(() => {
    const baseItems = [
      { id: "profile", label: "프로필 정보", actionType: "component"},
    ];
    if(!member?.fromSocial) {
      baseItems.push(
        { id: "change-password", label: "비밀번호 변경", actionType: "component"},
      );
    }
    baseItems.push(
    { id: "measurementlist", label: "내 건강정보 리스트", actionType: "component" },
    { id: "measurementchart", label: "내 건강정보 차트", actionType: "component" },
    );
    return baseItems;
  }, [member?.fromSocial])

  const componentMap = {
    "profile": Profile,
    "change-password": () => {
      if(member?.fromSocial) {
        return(
            <div className="text-center py-8">
              <p className="text-gray-500">소셜 로그인 회원은 비밀번호 변경을 할 수 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">
                {member.provider} 계정에서 비밀번호를 관리해주세요.
              </p>
            </div>
        );
      }
      return <ChangePassword/>
    },
    // 건강정보 조회 — 수정 버튼 클릭 시 수정 페이지로 이동
    measurementlist: () => {
      // 수정 모드일 때
      if (editId) {
        return (
            <div>
              <button
                  onClick={handleMypage}
                  className="mb-4 px-4 py-2 text-gray-700 transition"
              >
                ← 뒤로가기
              </button>
              <MeasurementEdit
                  mode="mypage"
                  id={editId}
                  presetData={selectedData}
                  onMypage={handleMypage}
                  onBack={() => {
                    setEditId(null);
                    setSelectedData(null);
                  }}
              />
            </div>
        );
      }

      // 리스트 모드일 때
      return (
          <MeasurementList
              mode="mypage"
              onEdit={(id, data) => {
                console.log(" 수정 클릭됨 ID:", id, data);
                setEditId(id);
                setSelectedData(data);
              }}
          />
      );
    },
    "measurementchart": MeasurementChart,
  };
  const {
    activeId,
    ActiveComponent,
    isComponentMode,
    handleAction,
    handleChange,
  } = useAsideNav({
    items: navItems,
    componentMap,
    defaultActiveId: "profile",
    scrollOffset: 100,
  });

  return(
      <div className="flex justify-center bg-gray-50 py-10 min-h-screen">
        <div className="grid grid-cols-[260px_1fr] gap-6 max-w-6xl w-full">
          {/* 왼쪽 네비 */}
          <AsideNav
              title="마이페이지"
              subtitle="내 정보 관리"
              items={navItems}
              sticky={{ enabled: true, top: 24, width: 260 }}
              scroll={{ offset: 100, smooth: true, spy: true }}
              ui={{
                activeGradientClass: "bg-gradient-to-r from-pink-400 to-purple-400",
                inactiveHoverClass: "hover:bg-purple-50",
                buttonHeightClass: "h-11",
              }}
              activeId={activeId}
              onChange={handleChange}
              onAction={handleAction}
          />

          {/* 오른쪽 내용 */}
          <main className="bg-white border rounded-2xl shadow-sm p-8">
            {ActiveComponent ? (
                <ActiveComponent />
            ) : (
                <p className="text-gray-500">메뉴를 선택하세요.</p>
            )}
          </main>
        </div>
      </div>
  )
}