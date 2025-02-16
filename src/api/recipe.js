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

    // 레시피 검색 조건 추가
    if (recipeSearch.recipeName) {
        params.append("recipeName", recipeSearch.recipeName);
    }

    if (recipeSearch.recipeDescription) {
        params.append("recipeDescription", recipeSearch.recipeDescription);
    }

    if (recipeSearch.difficulty && recipeSearch.difficulty !== '') {
        params.append("difficulty", recipeSearch.difficulty.code);
    }

    // ingredientId 리스트 추가
    let ingredientIds = [];
    if(Array.isArray(ingredients) && ingredients.length > 0) {
        ingredientIds = ingredients.map((ingredient) => ingredient.ingredientId);
        params.append("ingredientIds", ingredientIds);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}/recipe`, {params});
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

// 레시피 추가
export const addRecipe = async (formData) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/recipe/new`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data;
}