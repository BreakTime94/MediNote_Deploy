import React from "react";
import {Button} from "../ui/button/Button.jsx";
import { IoIosSearch } from "react-icons/io";

export default function Header() {
    return (
        <header className="w-full bg-white px-6 py-4">
            <div className="mx-auto max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">M</span>
                    </div>
                    <div className="leading-none">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] bg-clip-text text-transparent">
                            medinote
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">개인 의료관리 시스템</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        aria-label="검색"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        onClick={() => alert("검색 버튼 클릭!")}
                    >
                        <IoIosSearch size={18} />
                    </Button>

                    <Button
                        type="button"
                        className="rounded-full px-4 py-2 text-sm bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50"
                        onClick={() => alert("로그인 버튼 클릭!")}
                    >
                        로그인
                    </Button>

                    <Button
                        type="button"
                        className="rounded-full px-4 py-2 text-sm bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50"
                        onClick={() => alert("회원가입 버튼 클릭!")}
                    >
                        회원가입
                    </Button>

                    <Button
                        type="button"
                        className="rounded-full px-5 py-2 text-sm text-white border border-transparent bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] shadow-[0_8px_24px_rgba(200,156,255,0.35)] hover:brightness-[1.02]"
                        onClick={() => alert("마이페이지 버튼 클릭!")}
                    >
                        마이페이지
                    </Button>
                </div>
            </div>
        </header>
    );
}