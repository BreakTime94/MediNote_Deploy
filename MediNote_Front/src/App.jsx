import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";
import {Suspense, useEffect, useState} from "react";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

function App() {
  const fetchMember = useAuthStore((state) => state.fetchMember);
  const loading = useAuthStore((state) => state.loading);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage 복원이 완료되면 실행
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      console.log("Hydration 완료!"); // 디버깅용
      setHydrated(true);

      const currentState = useAuthStore.getState();
      if (currentState.member) {
        console.log("로그인 상태 확인 중...");
        fetchMember();
      } else {
        console.log("비로그인 상태");
      }
    });

    // 즉시 hydration 트리거
    useAuthStore.persist.rehydrate();

    return unsub;
  }, []); //zustand는 안정적이라고 해서 필요가 없다고 한다.

  if (!hydrated || loading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
  )
}

export default App
