import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 무조건 8083으로만 요청
  withCredentials: true, // JWT 쿠키 포함
});

// 요청 인터셉터 (요청 보내기 전에 가로챔)
api.interceptors.request.use(
    (config) => {
      console.log("request 바로 가져감:", config.method, config.url);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// 응답 인터셉터 (응답 받은 후 가로챔)
api.interceptors.response.use(
    (response) => {
      console.log("가로챈 response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn("401 Unauthorized: 로그인 필요");
      } else if (error.response?.status === 403) {
        console.warn("403 Forbidden: 권한 부족");
      }
      return Promise.reject(error);
    }
);

export default api;
