/* 레시피 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 레시피 목록 조뢰
export const getRecipe = async (page, recipeSearch) => {
    const pageSize = 10; // 페이지당 게시글 수

    // 검색 파라미터를
    const params = new URLSearchParams({
        page,
        size: pageSize
    });

    const response = await axiosInstance.post(`${API_BASE_URL}/recipe?${params.toString()}`, {
        recipeSearch
    });
    return response.data;
}
