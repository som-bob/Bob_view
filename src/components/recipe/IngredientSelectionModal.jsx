import {useEffect, useState} from "react";
import "./ingredientSelectionModal.css";

function IngredientSelectionModal({ingredients, onSelect, onClose}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {
        setFilteredIngredients(
            ingredients.filter((ingredient) =>
                ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, ingredients]);

    const toggleIngredientSelection = (ingredient) => {
        setSelectedIngredients((prev) => {
            if (prev.includes(ingredient)) {
                return prev.filter((item) => item.ingredientId !== ingredient.ingredientId);
            } else {
                return [...prev, ingredient];
            }
        });
    };

    const handleConfirm = () => {
        onSelect(selectedIngredients);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>재료 선택</h3>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="재료 검색"
                    className="search-input"
                />
                <ul className="ingredient-list">
                    {filteredIngredients.map((ingredient) => (
                        <li
                            key={ingredient.ingredientId}
                            className={`ingredient-item ${selectedIngredients.includes(ingredient) ? "selected" : ""}`}
                            onClick={() => toggleIngredientSelection(ingredient)}
                        >
                            {ingredient.ingredientName}
                        </li>
                    ))}
                </ul>
                <div className="modal-actions">
                    <button onClick={handleConfirm} className="button-primary">확인</button>
                    <button onClick={onClose} className="button-secondary">취소</button>
                </div>
            </div>
        </div>
    );
}

export default IngredientSelectionModal;