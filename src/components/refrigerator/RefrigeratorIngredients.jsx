import React, {useState} from "react";
import "./refrigeratorIngredients.css";
import {getDefaultIngredientImage} from "../../utils/imageUtils.js";

function RefrigeratorIngredients({ingredients, onDeleteIngredient}) {
    const [selectedIngredient, setSelectedIngredient] = useState(null); // 선택된 재료
    const [isConfirmVisible, setIsConfirmVisible] = useState(false); // 확인 팝업 표시 여부

    const handleIngredientClick = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsConfirmVisible(true); // 확인 팝업 표시
    };

    const handleConfirm = (isConfirmed) => {
        if (isConfirmed && selectedIngredient) {
            onDeleteIngredient(selectedIngredient.ingredientId);
        }
        setIsConfirmVisible(false); // 팝업 닫기
        setSelectedIngredient(null); // 선택 초기화
    };

    const renderTiles = () => {
        if (!ingredients || ingredients.length === 0) {
            return <p>냉장고에 재료가 없습니다.</p>;
        }

        return ingredients.map((ingredient) => (
            <div className="ingredient-tile" key={ingredient.ingredientId}
                 onClick={() => handleIngredientClick(ingredient)}
            >
                <img
                    src={getDefaultIngredientImage(ingredient.ingredientUrl)}
                    alt={ingredient.ingredientName}
                    className="ingredient-image"
                />
                <div className="ingredient-info">
                    <p className="ingredient-name">{ingredient.ingredientName}</p>
                    <p className="ingredient-date">{ingredient.addedDate}</p>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="refrigerator-grid">
                {renderTiles()}
            </div>
            {isConfirmVisible && (
                <>
                    <div className="overlay"></div>
                    <div className="confirm-dialog">
                        <p>
                            '{selectedIngredient?.ingredientName}' 재료를 삭제 하시겠습니까?
                        </p>
                        <button onClick={() => handleConfirm(true)}>네</button>
                        <button onClick={() => handleConfirm(false)}>아니요</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RefrigeratorIngredients;
