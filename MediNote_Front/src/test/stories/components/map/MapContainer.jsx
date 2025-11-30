// 변경 전 (loader 사용)
// const [loading, error] = useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_JS_KEY });

// 변경 후 (loader 제거)
import { Map } from "react-kakao-maps-sdk";

export default function MapContainer() {
    return (
        <Map
            center={{ lat: 33.5563, lng: 126.79581 }}
            level={3}
            style={{ width: "800px", height: "600px" }}
        />
    );
}
