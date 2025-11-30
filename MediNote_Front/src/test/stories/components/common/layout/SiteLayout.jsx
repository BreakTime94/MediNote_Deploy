import Header from "./Header.jsx";
import SiteNavbar from "./SiteNavbar.jsx";
import Footer from "./Footer.jsx";

export default function SiteLayout({ children }) {
    return (
        <div className="min-h-dvh flex flex-col bg-white text-gray-900">
            <Header />
            <SiteNavbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}