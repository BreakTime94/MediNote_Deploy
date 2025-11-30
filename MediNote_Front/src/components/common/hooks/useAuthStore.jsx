import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axiosInterceptor.js";
import {useNavigate} from "react-router-dom";

// Zustand 스토어 생성
export const useAuthStore = create(

    persist(
        (set) => ({
          member: null,       // 로그인 사용자 정보
          loading: false,      // 초기 로딩

          setMember: (data) => set({ member: data }),

          logout: async () => {
            try {
              await api.post("/member/auth/logout");
            } catch (_) {}
            set({ member: null });
          },
          fetchMember: async () => {
            set({loading: true})
            try {
              const res = await api.get("/member/get");
              set({ member: res.data.member, loading: false });
            } catch {
              set({ member: null, loading: false });
            }
          },
        }),
        {
          name: "auth-storage", // localStorage key 이름
          partialize: (state) => ({ member: state.member }), // persist할 값
        }
    )
);
