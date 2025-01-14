import React, { useCallback, useEffect, useState } from "react";
import { getRecipe } from "../../api/recipe";
import {Pagination} from "../../utils/pageUtils.js";

function RecipeList() {
    const [recipes, setRecipes] = useState([]); // 레시피 목록
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [recipeSearch, setRecipeSearch] = useState({
        recipeName: '',
        recipeDescription: '',
        difficulty: '',
        ingredientIds: '',
    });

    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

    // 레시피 목록을 가져오는 함수
    const fetchRecipeList = useCallback(
        async (page = 0) => {
            setIsLoading(true); // 로딩 시작
            try {
                const response = await getRecipe(page, recipeSearch);
                const { content, totalPages } = response.data;

                setRecipes(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("레시피 조회에 실패했습니다.", error);
                alert("레시피 조회에 실패했습니다.");
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        },
        [recipeSearch]
    );

    // 페이지나 검색 조건 변경 시 데이터를 새로 로드
    useEffect(() => {
        fetchRecipeList(currentPage);
    }, [currentPage, fetchRecipeList]);

    // 페이지 번호 리스트 계산
    const getPaginationRange = () => {
        const range = [];
        const start = Math.max(0, currentPage - 4); // 현재 페이지 기준으로 최대 4개 앞쪽
        const end = Math.min(totalPages, start + 10); // 총 10개의 페이지 번호 표시

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // 페이지 번호 목록 생성
    const getPageNumbers = () => {
        const range = 2; // 현재 페이지를 기준으로 표시할 페이지 수
        const startPage = Math.max(0, currentPage - range);
        const endPage = Math.min(totalPages - 1, currentPage + range);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return (
        <div>
            <h1>레시피 목록</h1>

            {/* 검색 바 */}
            <div>
                <input
                    type="text"
                    placeholder="레시피 이름 검색"
                    value={recipeSearch.recipeName}
                    onChange={(e) =>
                        setRecipeSearch({ ...recipeSearch, recipeName: e.target.value })
                    }
                />
                <button onClick={() => fetchRecipeList(0)}>검색</button>
            </div>

            {/* 로딩 상태 */}
            {isLoading && <p>로딩 중...</p>}

            {/* 레시피 리스트 */}
            <div>
                {recipes.map((recipe) => (
                    <div key={recipe.recipeId}>
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.recipeName}
                        />
                        <h3>{recipe.recipeName}</h3>
                        <p>난이도: {recipe.difficulty}</p>
                        <p>인분: {recipe.servings}</p>
                        <p>재료</p>
                        <ul>
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>{ingredient.ingredientName}</li>
                            ))}
                        </ul>
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
