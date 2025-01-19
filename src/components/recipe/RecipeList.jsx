import React, {useCallback, useEffect, useState} from "react";
import {getRecipe, getRecipeDifficulty} from "../../api/recipe";
import {Pagination} from "../../utils/pageUtils.jsx";
import RecipeSearch from "./RecipeSearch.jsx";
import "./recipeList.css";

function RecipeList() {
    const [recipes, setRecipes] = useState([]); // 레시피 목록
    const [difficulties, setDifficulties] = useState([]); // 난이도 목록
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [ingredients, setIngredients] = useState([]); // 검색 재료 리스트
    const [recipeSearch, setRecipeSearch] = useState({ // 검색 조건
        recipeName: "",
        recipeDescription: "",
        difficulty: "",
        ingredientIds: "",
    });

    // 레시피 목록 가져오기
    const fetchRecipeList = useCallback(
        async (page = 0) => {
            try {
                const response = await getRecipe(page, recipeSearch, ingredients);
                const {content, totalPages} = response.data;
                setRecipes(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("레시피 조회에 실패했습니다.", error);
                alert("레시피 조회에 실패했습니다.");
            }

            try {
                const response = await getRecipeDifficulty();
                setDifficulties(response.data);
            } catch (error) {
                console.error("난이도 조회에 실패했습니다.", error);
            }
        },
        [recipeSearch, ingredients]
    );

    // 페이지 변경
    useEffect(() => {
        fetchRecipeList(currentPage);
    }, [currentPage, ingredients, recipeSearch]);

    const handleSearch = () => {
        setCurrentPage(0);
        fetchRecipeList(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageNumbers = () => {
        const range = 2;
        const startPage = Math.max(0, currentPage - range);
        const endPage = Math.min(totalPages - 1, currentPage + range);
        return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
    };

    return (
        <div>
            {/* 검색 및 조건 관리 */}
            <RecipeSearch
                recipeSearch={recipeSearch}
                setRecipeSearch={setRecipeSearch}
                ingredients={ingredients}
                setIngredients={setIngredients}
                difficulties={difficulties}
                handleSearch={handleSearch}
            />

            {/* 레시피 리스트 */}
            <div className="recipe-list">
                {recipes.map((recipe) => (
                    <div key={recipe.recipeId} className="recipe-card">
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.recipeName}
                            className="recipe-image"
                        />
                        <div className="recipe-content">
                            <h3 className="recipe-name">{recipe.recipeName}</h3>
                            <p className="recipe-description">{recipe.recipeDescription}</p>
                            <p className="recipe-difficulty">
                                <b>난이도</b> {recipe.difficulty.title}
                            </p>
                            <p className="recipe-servings">{recipe.servings}</p>
                            <p className="recipe-ingredients-title">필요한 재료</p>
                            <ul className="recipe-ingredients">
                                {recipe.ingredients.map((ingredient) => (
                                    // TODO 클릭하면 재료 추가
                                    <li key={ingredient.id} className="ingredient-item">
                                        {ingredient.ingredientName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                getPageNumbers={getPageNumbers}
            />
        </div>
    );
}

export default RecipeList;