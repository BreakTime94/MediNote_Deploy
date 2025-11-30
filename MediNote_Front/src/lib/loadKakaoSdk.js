let loadPromise = null;

export function loadKakaoSdk(appKey) {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Not running in browser"));
    }

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
        return Promise.resolve(window.kakao);
    }

    // 중복 요청 방지
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        const existing = document.getElementById("kakao-sdk");
        if (existing) {
            existing.addEventListener("load", () => resolve(window.kakao));
            existing.addEventListener("error", reject);
            return;
        }

        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (!window.kakao || !window.kakao.maps) {
                reject(new Error("Kakao SDK object missing"));
                return;
            }
            window.kakao.maps.load(() => resolve(window.kakao));
        };
        script.onerror = () => reject(new Error("Failed to load Kakao SDK"));

        document.head.appendChild(script);
    });

    return loadPromise;
}
