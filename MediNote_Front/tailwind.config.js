export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            },
            colors: {
                //밑의 항목은 예시,
                // 필요 시 전역 컬러
                primary: {
                    500: "#7c4dff",   // 포인트
                },
                purpley: "#c89cff",
            },
            backgroundImage: {
                // 전역 그라데이션 프리셋 (선택사항)
                "grad-main": "linear-gradient(90deg, #ff9bd4 0%, #c89cff 100%)",
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
        },
    },
    plugins: [],
}