/* 레시피 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 레시피 목록 조뢰
export const getRecipes = async (page, recipeSearch, ingredients) => {
    const pageSize = 20; // 페이지당 게시글 수

    // 검색 파라미터를
    const params = new URLSearchParams({
        page,
        size: pageSize
    });

    // ingredientId 리스트 추출
    let ingredientIds = [];
    if(Array.isArray(ingredients) && ingredients.length > 0) {
        ingredientIds = ingredients.map((ingredient) => ingredient.ingredientId);
    }

    const response = await axiosInstance.post(`${API_BASE_URL}/recipe?${params.toString()}`, {
        recipeName: recipeSearch.recipeName,
        recipeDescription: recipeSearch.recipeDescription,
        ingredientIds: ingredientIds,
        difficulty: recipeSearch.difficulty === '' ? null : recipeSearch.difficulty,
    });
    return response.data;
}

// 레시피 난이도 조회
export const getRecipeDifficulty = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/recipe/difficulty`);
    return response.data;
}

// 레시피 상세 조회
export const getRecipe = async (recipeId) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/recipe/${recipeId}`);
    return response.data;
}