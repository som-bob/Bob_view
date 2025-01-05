/* 나의 냉장고 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 나의 냉장고 조회
export const getRefrigerator = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/refrigerator`);
    return response.data;
}