import SiteHeader from "../components/common/header/SiteHeader.jsx";
import MainNav from "../components/common/nav/MainNav.jsx";
import {Outlet} from "react-router-dom";
import SiteFooter from "../components/common/footer/SiteFooter.jsx";
import {Toaster} from "react-hot-toast";

export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* 전체 화면 높이를 차지하는 flex 컨테이너 */}

            <header>
                <SiteHeader/>
                <MainNav/>
            </header>

            <main className="flex-1">
                {/* flex-1: 남은 공간을 전부 차지 */}
                <Outlet/>
            </main>

            <footer>
                <SiteFooter/>
            </footer>
          {/* react-hot-toast는 이게 없으면 안 보임 */}
          <Toaster position="top-center" />
        </div>
    );
}