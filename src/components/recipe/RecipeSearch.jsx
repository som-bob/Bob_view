import { getAllIngredients } from "../../api/refrigerator.js";
import { useState } from "react";
import "./recipeSearchFields.css";
import {getAllIngredient} from "../../api/ingredient.js";

function RecipeSearch({
                          recipeSearch,
                          setRecipeSearch,
                          ingredients,
                          setIngredients,
                          difficulties,
                          handleSearch,
                      }) {
    // 모달 상태 관리
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false); // 추가 모달 상태
    const [allIngredient, setAllIngredient] = useState([]); // 모든 재료 정보
    const [filteredIngredients, setFilteredIngredients] = useState([]); // 필터링된 재료
    const [selectedNewIngredients, setSelectedNewIngredients] = useState([]); // 새로 선택된 재료
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    // 재료 제거 함수
    const removeIngredient = () => {
        if (selectedIngredient) {
            setIngredients((prevIngredients) =>
                prevIngredients.filter(
                    (ingredient) => ingredient.ingredientId !== selectedIngredient.ingredientId
                )
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
        const { name, value } = e.target;

        // `difficulty`가 변경된 경우 `code`로 객체 매핑
        if (name === "difficulty") {
            const selectedDifficulty = difficulties.find((d) => d.code === value);
            setRecipeSearch((prev) => ({
                ...prev,
                difficulty: selectedDifficulty || "",
            }));
        } else {
            setRecipeSearch((prev) => ({ ...prev, [name]: value }));
        }
    };

    const getRefrigeratorIngredient = async () => {
        try {
            const response = await getAllIngredients();
            const data = response.data;

            setIngredients((prev) => {
                // 기존 ingredients의 id를 Set으로 저장하여 중복 확인
                const existingIds = new Set(prev.map((ingredient) => ingredient.ingredientId));

                // 선택된 재료 중 기존에 없는 재료만 필터링
                const newIngredients = data.filter(
                    (ingredient) => ! existingIds.has(ingredient.ingredientId)
                );

                return [...prev, ...newIngredients];
            });
        } catch (error) {
            const responseData = error.response.data;
            if (error.status === 400) {
                alert(responseData.errorMessage);
            } else {
                alert("냉장고 재료 가져오기에 실패했습니다.");
            }
        }
    };

    const handleSearchIngredient = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredIngredients(
            allIngredient.filter(ingredient =>
                ingredient.ingredientName.toLowerCase().includes(term)
            )
        );
    };

    const renderTiles = () => {
        if (!ingredients || ingredients.length === 0) {
            return (
                <div>
                    <p>레시피에 들어가는 재료를 함께 검색해보세요.(재료 추가 버튼)</p>
                </div>
            );
        }

        return ingredients.map((ingredient) => (
            <li
                className="search-ingredient-item"
                key={ingredient.ingredientId}
                onClick={() => handleIngredientClick(ingredient)}
            >
                <p>{ingredient.ingredientName}</p>
            </li>
        ));
    };

    const clearIngredients = () => {
        setIngredients([]);
    };

    // 새 재료 추가 모달 열기
    const openAddIngredientModal = async () => {
        try {
            const response = await getAllIngredient();
            const data = response.data;

            // id를 ingredientId로 매핑
            const mappedData = data.map((item) => ({
                ingredientId: item.id, // id를 ingredientId로 변경
                ingredientName: item.ingredientName,
                ingredientDescription: item.ingredientDescription,
                imageUrl: item.imageUrl
            }));

            setFilteredIngredients(mappedData);
            setAllIngredient(mappedData);
            setIsAddIngredientModalOpen(true); // 모달 열기
        } catch (error) {
            console.error("재료 목록을 가져오는 데 실패했습니다.", error);
        }
    };

    // 새 재료 추가 모달 닫기
    const closeAddIngredientModal = () => {
        setSearchTerm("");
        setIsAddIngredientModalOpen(false); // 모달 닫기
        setSelectedNewIngredients([]); // 선택 초기화
    };

    // 새 재료 선택
    const toggleNewIngredient = (ingredient) => {
        setSelectedNewIngredients((prevSelected) => {
            if (prevSelected.includes(ingredient)) {
                return prevSelected.filter((item) => item.ingredientId !== ingredient.ingredientId);
            } else {
                return [...prevSelected, ingredient];
            }
        });
    };

    // 선택된 재료 추가
    const confirmAddIngredients = () => {
        // setIngredients((prev) => [...prev, ...selectedNewIngredients]);
        setIngredients((prev) => {
            // 기존 ingredients의 id를 Set으로 저장하여 중복 확인
            const existingIds = new Set(prev.map((ingredient) => ingredient.ingredientId));

            // 선택된 재료 중 기존에 없는 재료만 필터링
            const newIngredients = selectedNewIngredients.filter(
                (ingredient) => ! existingIds.has(ingredient.ingredientId)
            );

            return [...prev, ...newIngredients];
        });
        setSearchTerm("");
        closeAddIngredientModal();
    };

    return (
        <div className="recipe-search">
            {/* 재료 목록 */}
            <ul className="search-ingredients">{renderTiles()}</ul>

            {/* 버튼 */}
            <div className="recipe-ingredients-search-button">
                <button onClick={getRefrigeratorIngredient}>내 냉장고 재료 추가</button>
                <button onClick={openAddIngredientModal}>재료 추가</button>
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
                    value={recipeSearch.difficulty?.code || ""}
                    onChange={handleSearchChange}
                >
                    <option value="">난이도를 선택하세요.</option>
                    {difficulties.map((difficulty) => (
                        <option key={difficulty.code} value={difficulty.code}>
                            {difficulty.title}
                        </option>
                    ))}
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* 재료 삭제 모달 */}
            {selectedIngredient && (
                <div className="modal">
                    <div className="modal-content">
                        <p>
                            '{selectedIngredient.ingredientName}' 재료를 삭제 하시겠습니까?
                        </p>
                        <div className="modal-actions">
                            <button onClick={removeIngredient} className="button-primary">
                                네
                            </button>
                            <button onClick={closeModal} className="button-secondary">
                                아니요
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 재료 추가 모달 */}
            {isAddIngredientModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>재료 추가 하기</h3>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchIngredient}
                            onKeyDown={handleSearchIngredient}
                            placeholder="재료 검색"
                            className="search-input"
                        />
                        <ul className="ingredient-list">
                            {filteredIngredients.map((ingredient) => (
                                <li
                                    key={ingredient.ingredientId}
                                    className={`ingredient-item ${
                                        selectedNewIngredients.includes(ingredient) ? "selected" : ""
                                    }`}
                                    onClick={() => toggleNewIngredient(ingredient)}
                                >
                                    {ingredient.ingredientName}
                                </li>
                            ))}
                        </ul>
                        <div className="modal-actions">
                            <button onClick={confirmAddIngredients} className="button-primary">
                                확인
                            </button>
                            <button onClick={closeAddIngredientModal} className="button-secondary">
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecipeSearch;
