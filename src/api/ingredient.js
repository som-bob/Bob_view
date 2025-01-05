/* 재료 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 모든 재료 조회
export const getAllIngredient = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/ingredient`);
        return response.data;
    } catch (error) {
        console.log('재료 조회 실패: ', error);
        throw error;
    }
}