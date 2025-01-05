import { useState } from "react";
import './ingredient.css'
import {getTodayDate} from "../utils/dateUtils.js";

function IngredientAdd({ allIngredient, onAddIngredient }) {
    const [selectedIngredient, setSelectedIngredient] = useState(null); // 선택된 재료
    const [isConfirmVisible, setIsConfirmVisible] = useState(false); // 확인 팝업 표시 여부

    const handleIngredientClick = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsConfirmVisible(true); // 확인 팝업 표시
    };

    const handleConfirm = (isConfirmed) => {
        if (isConfirmed && selectedIngredient) {
            const today = getTodayDate();
            onAddIngredient(selectedIngredient.id, today); // 오늘 날짜로 재료 추가
        }
        setIsConfirmVisible(false); // 팝업 닫기
        setSelectedIngredient(null); // 선택 초기화
    };

    const renderIngredientGrid = () => {
        return allIngredient.map((ingredient) => (
            <div
                key={ingredient.id}
                className="ingredient-item"
                onClick={() => handleIngredientClick(ingredient)}
                title={ingredient.ingredientName} // 툴팁에 재료 이름 표시
            >
                <img
                    src={ingredient.imageUrl}
                    alt={ingredient.ingredientName}
                    className="ingredient-icon"
                />
                <p className="ingredient-name">{ingredient.ingredientName}</p>
            </div>
        ));
    };

    return (
        <div className="ingredient-add-container">
            <h3>재료 추가</h3>
            <div className="ingredient-grid">{renderIngredientGrid()}</div>

            {isConfirmVisible && (
                <div className="confirm-dialog">
                    <p>
                        '{selectedIngredient?.ingredientName}' 재료를 추가 하시겠습니까?
                    </p>
                    <button onClick={() => handleConfirm(true)}>네</button>
                    <button onClick={() => handleConfirm(false)}>아니요</button>
                </div>
            )}
        </div>
    );
}

export default IngredientAdd;
