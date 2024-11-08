import axios     from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// 요청 인터셉터 설정 (accessToken 추가)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // 헤더에 토큰 추가
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정 (401 에러 감지 및 토큰 재발급)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지

            try {
                const newAccessToken = await reissueToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 실패했던 요청을 다시 전송
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error('토큰 재발급 중 에러 발생:', error);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

const reissueToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post(`${API_BASE_URL}/member/reissue`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`, // 정확한 형식 확인
            },
        });
        // 새로운 accessToken, refreshToken 저장
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        return accessToken;
    } catch (error) {
        console.error('토큰 재발급 실패:', error);
        throw error;
    }
};

export default axiosInstance;