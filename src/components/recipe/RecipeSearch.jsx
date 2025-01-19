import {getAllIngredients} from "../../api/refrigerator.js";
import {useState} from "react";
import "./recipeSearchFields.css";

function RecipeSearch({
                                  recipeSearch, setRecipeSearch, ingredients, setIngredients, difficulties, handleSearch
                              }) {
    // 모달 상태 관리
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    // 재료 제거 함수
    const removeIngredient = () => {
        if (selectedIngredient) {
            setIngredients((prevIngredients) =>
                prevIngredients.filter((ingredient) => ingredient.ingredientId !== selectedIngredient.ingredientId)
            );
            setSelectedIngredient(null); // 모달 닫기
        }
    };

    const handleIngredientClick = (ingredient) => {
        setSelectedIngredient(ingredient); // 모달 열기
    };

    const closeModal = () => {
        setSelectedIngredient(null); // 모달 닫기
    };

    const handleSearchChange = (e) => {
        const {name, value} = e.target;
        if (name) {
            setRecipeSearch((prev) => ({...prev, [name]: value}));
        }
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
                alert("냉장고 재료 가져오기에 실패했습니다.");
            }
        }
    };

    const renderTiles = () => {
        if (!ingredients || ingredients.length === 0) {
            return (<div>
                <p>레시피에 들어가는 재료를 함께 검색해보세요.(재료 추가 버튼)</p>
            </div>);
        }

        return ingredients.map((ingredient) => (<li
            className="search-ingredient-item"
            key={ingredient.ingredientId}
            onClick={() => handleIngredientClick(ingredient)}
        >
            <p>{ingredient.ingredientName}</p>
        </li>));
    };

    const clearIngredients = () => {
        setIngredients([]);
    };

    return (
        <div className="recipe-search">
            {/* 재료 목록 */}
            <ul className="search-ingredients">{renderTiles()}</ul>

            {/* 버튼 */}
            <div className="recipe-ingredients-search-button">
                <button onClick={getRefrigeratorIngredient}>내 냉장고 재료</button>
                <button>재료 추가하기</button>
                <button onClick={clearIngredients}>재료 비우기</button>
            </div>

            {/* 검색 필드 */}
            <div>
                <input
                    type="text"
                    name="recipeName"
                    value={recipeSearch.recipeName}
                    onChange={handleSearchChange}
                    placeholder="레시피 이름"
                />
                <input
                    type="text"
                    name="recipeDescription"
                    value={recipeSearch.recipeDescription}
                    onChange={handleSearchChange}
                    placeholder="레시피 설명"
                />
                <select
                    id="difficulty"
                    name="difficulty"
                    value={recipeSearch.difficulty}
                    onChange={handleSearchChange}
                >
                    <option value="">난이도를 선택하세요.</option>
                    {difficulties.map((difficulty) => (<option key={difficulty.code} value={difficulty.code}>
                        {difficulty.title}
                    </option>))}
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>


            {/* 모달 */}
            {selectedIngredient && (
                <div className="modal">
                    <div className="modal-content">
                        <p>
                            '{selectedIngredient.ingredientName}' 재료를 삭제하시겠습니까?
                        </p>
                        <div className="modal-actions">
                            <button onClick={removeIngredient} className="button-primary">네</button>
                            <button onClick={closeModal} className="button-secondary">아니요</button>
                        </div>
                    </div>
                </div>
            )}
        </div>);
}

export default RecipeSearch;
