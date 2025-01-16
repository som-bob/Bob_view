/* 나의 냉장고 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 나의 냉장고 조회
export const getRefrigerator = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/refrigerator`);
        return response.data;
    } catch (error) {
        console.log('나의 냉장고 조회 실패: ', error);
        throw error;
    }
}

// 나의 냉장고 생성
export const createRefrigerator = async (nickName) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/refrigerator`, {
            nickName
        });
        return response.data;
    } catch (error) {
        console.log('나의 냉장고 생성 실패: ', error);
        throw error;
    }
}

// 나의 냉장고 재료 추가
export const addIngredientToRefrigerator = async (refrigeratorId, ingredientId, addedDate) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/refrigerator/${refrigeratorId}/ingredient`, {
        ingredientId: ingredientId,
        addedDate: addedDate,
    });
    return response.data;
};

// 나의 냉장고 재료 삭제
export const deleteIngredientToRefrigerator = async (refrigeratorId, refrigeratorIngredientId) => {
    const response = await axiosInstance.delete(
        `${API_BASE_URL}/refrigerator/${refrigeratorId}/ingredient/${refrigeratorIngredientId}`);
    return response.data;
}

// 나의 냉장고 재료 모두 삭제
export const deleteAllIngredientToRefrigerator = async (refrigeratorId) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/refrigerator/${refrigeratorId}/ingredients`);
    return response.data;
}

// 나의 냉장고 재료 조회
export const getAllIngredients = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/refrigerator/ingredients`);
    return response.data;
}


