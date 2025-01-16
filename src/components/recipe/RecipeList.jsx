import React, {useCallback, useEffect, useState} from "react";
import {getRecipe, getRecipeDifficulty} from "../../api/recipe";
import {Pagination} from "../../utils/pageUtils.jsx";
import {getAllIngredients} from "../../api/refrigerator.js";
import "./recipeList.css";
import "./recipeSearchFields.css"

function RecipeList() {
    const [recipes, setRecipes] = useState([]); // 레시피 목록
    const [difficulties, setDifficulties] = useState([]);   // 난이도 목록
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [ingredients, setIngredients] = useState(null); // 검색 재료 리스트
    const [recipeSearch, setRecipeSearch] = useState({      // 검색 조건
        recipeName: '',
        recipeDescription: '',
        difficulty: '',
        ingredientIds: '',
    });

    // 레시피 목록, 난이도를 가져오는 함수
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
        [recipeSearch]
    );

    const renderTiles = () => {
        if (!ingredients || ingredients.length === 0) {
            return <div>
                <p>선택된 재료가 없습니다.</p>
            </div>;
        }

        return ingredients.map((ingredient) => (
            <div key={ingredient.ingredientId}>
                <div>
                    <p>{ingredient.ingredientName}</p>
                </div>
            </div>
        ));
    };

    // 페이지나 검색 조건 변경 시 데이터를 새로 로드
    useEffect(() => {
        fetchRecipeList(currentPage);
    }, [currentPage, fetchRecipeList, ingredients, recipeSearch]);

    // 검색 조건 변경 핸들러
    const handleSearchChange = (e) => {
        const {name, value} = e.target;
        // name이 유효한 경우만 상태를 업데이트
        if (name) {
            setRecipeSearch((prevParams) => ({
                ...prevParams,
                [name]: value,
            }));
        }
    };

    // 검색 실행
    const handleSearch = () => {
        setCurrentPage(0); // 첫 페이지로 초기화
        fetchRecipeList(0);
    };

    // 검색 필드에서 엔터 키를 누르면 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
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
        return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
    };

    const getRefrigeratorIngredient = async () => {
        try {
            const response = await getAllIngredients();
            const data = response.data;

            setIngredients(data);
        } catch (error) {
            const responseData = error.response.data;
            if (error.status === 400) {
                alert(responseData.errorMessage);
            } else {
                alert("냉장고 재료 가져오기에 실패했습니다.")
            }
        }
    }

    const clearIngredients = () => {
        setIngredients([]);
    }


    return (
        <div>
            {/* 검색 필드 */}
            <div className="recipe-search">
                <div className="recipe-ingredients-search">
                    {renderTiles()}
                </div>
                <div className="recipe-ingredients-search-button">
                    <button onClick={clearIngredients}>재료 비우기</button>
                    <button onClick={getRefrigeratorIngredient}>내 냉장고 재료</button>
                    <button>재료 추가하기</button>
                </div>
                <SearchFields
                    recipeSearch={recipeSearch}
                    difficultiesSearch={difficulties}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearch}
                    onKeyDown={handleKeyDown}
                />
            </div>


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
                            <p className="recipe-difficulty"><b>난이도</b> {recipe.difficulty.title}</p>
                            <p className="recipe-servings">{recipe.servings}</p>
                            <p className="recipe-ingredients-title">필요한 재료</p>
                            <ul className="recipe-ingredients">
                                {recipe.ingredients.map((ingredient) => (
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

// 검색 필드 컴포넌드
function SearchFields({recipeSearch, difficultiesSearch, onSearchChange, onSearch, onKeyDown}) {
    return (
        <div>
            <input
                type="text"
                name="recipeName"
                value={recipeSearch.recipeName}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="레시피 이름"
            />
            <input
                type="text"
                name="recipeDescription"
                value={recipeSearch.recipeDescription}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="레시피 설명"
            />
            <div>
                <select
                    id="difficulty"
                    name="difficulty" // 상태 key와 동일하게 설정
                    value={recipeSearch.difficulty} // 현재 선택된 값
                    onChange={onSearchChange} // 선택 변경 핸들러
                >
                    <option value="">
                        난이도를 선택하세요.
                    </option>
                    {difficultiesSearch.map((difficulty) => (
                        <option key={difficulty.code} value={difficulty.code}>
                            {difficulty.title}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={onSearch}>검색</button>
        </div>
    );
}