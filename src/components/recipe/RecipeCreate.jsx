import {useNavigate} from "react-router-dom";
import {addRecipe, getRecipeDifficulty} from "../../api/recipe";
import {useEffect, useState} from "react";
import "./recipeCreate.css";
import IngredientSelectionModal from "./IngredientSelectionModal.jsx";
import {getAllIngredient} from "../../api/ingredient.js";

function RecipeCreate() {
    const navigate = useNavigate();
    const [difficulties, setDifficulties] = useState([]); // 난이도 목록
    const [recipe, setRecipe] = useState({
        recipeName: "",
        recipeDescription: "",
        difficulty: "",
        servings: "",
        cookingTime: "",
        recipeFile: null,
        ingredients: [],
        recipeDetails: []
    });
    const [ingredientList, setIngredientList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadIngredients = async () => {
            const response = await getAllIngredient();
            setIngredientList(response.data);
        }
        const loadDifficulties = async () => {

            const response = await getRecipeDifficulty();
            setDifficulties(response.data);
        }

        loadIngredients();
        loadDifficulties()
    }, []);


    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'difficulty') {
            const selectDifficulty = difficulties.find((d) => d.code === value);
            setRecipe({
                ...recipe,
                difficulty: selectDifficulty || ""
            });
        } else {
            setRecipe({...recipe, [name]: value});
        }
    };

    const handleFileChange = (e) => {
        setRecipe({...recipe, recipeFile: e.target.files[0]});
    };

    const handleDetailFileChange = (index, file) => {
        const updateRecipeDetail = [...recipe.recipeDetails];
        updateRecipeDetail[index].recipeDetailFile = file;
        setRecipe({...recipe, recipeDetails: updateRecipeDetail});
    };

    const handleIngredientSelection = (selectedIngredients) => {
        setRecipe(prevRecipe => {
            const existingIds = new Set(prevRecipe.ingredients.map(ing => ing.id));
            const newIngredients = selectedIngredients.filter(ingredient => !existingIds.has(ingredient.id)).map(ingredient => ({
                ...ingredient,
                amount: ""
            }));
            return {
                ...prevRecipe,
                ingredients: [...prevRecipe.ingredients, ...newIngredients]
            };
        });
        setIsModalOpen(false);
    };


    const handleAddDetail = () => {
        setRecipe({
            ...recipe,
            recipeDetails: [...recipe.recipeDetails, {recipeDetailText: "", recipeDetailFile: null}]
        });
    }

    const handleRemoveDetail = (index) => {
        const updateDetails = recipe.recipeDetails.filter((_, i) => i !== index);
        setRecipe({...recipe, recipeDetails: updateDetails});
    }

    const handleRemoveIngredient = (index) => {
        const updateIngredients = recipe.ingredients.filter((_, i) => i !== index);
        setRecipe({...recipe, ingredients: updateIngredients});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // JSON 데이터 변환 (Blob 사용)
        const jsonBlob = new Blob([JSON.stringify({
            ...recipe,
            difficulty: recipe.difficulty ? {code: recipe.difficulty.code} : null,
            recipeDetails: recipe.recipeDetails.map(detail => ({
                recipeDetailText: detail.recipeDetailText,
            })),
            recipeFile: null,   // 파일은 json 안에서 제거한다
            ingredients: recipe.ingredients.map(ingredient => ({
                ingredientId: ingredient.id,
                ingredientDetailName: ingredient.ingredientDetailName || ingredient.ingredientName,
                amount: ingredient.amount
            }))
        })], {type: "application/json"});

        formData.append("data", jsonBlob);

        // 메인 레시피 파일 추가
        if (recipe.recipeFile) {
            formData.append("recipeFile", recipe.recipeFile);
        }

        // 상세 레시피 이미지 파일 추가 (배열로 전달, null 자리에 빈 Blob 전달)
        recipe.recipeDetails.forEach((detail) => {
            formData.append("recipeDetailsFiles", detail.recipeDetailFile || new Blob());
        });

        try {
            const response = await addRecipe(formData);
            const recipeId = Number(response.data);
            alert("레시피를 성공적으로 저장했습니다.");
            navigate(`/recipe/${recipeId}`);
        } catch (error) {
            const responseData = error.response.data;
            if (error.status === 400) {
                alert(responseData.errorMessage);
            } else {
                alert("레시피 추가에 실패했습니다.");
            }
        }
    }


    return (
        <div className="recipe-create-container">
            <h2 className="recipe-create-title">레시피 추가</h2>
            <form onSubmit={handleSubmit} className="recipe-create-form">
                {/* 레시피 정보 */}
                <input
                    type="text"
                    name="recipeName"
                    placeholder="레시피 이름"
                    value={recipe.recipeName}
                    onChange={handleChange} className="recipe-input"/>
                <textarea
                    name="recipeDescription"
                    placeholder="레시피 설명"
                    value={recipe.recipeDescription}
                    onChange={handleChange} className="recipe-textarea"></textarea>
                <input
                    type="text"
                    name="servings"
                    placeholder="몇인분"
                    value={recipe.servings}
                    onChange={handleChange} className="recipe-input"/>
                <input
                    type="number"
                    name="cookingTime"
                    placeholder="소요 시간(분)"
                    value={recipe.cookingTime}
                    onChange={handleChange} className="recipe-input"/>
                <select
                    id="difficulty"
                    name="difficulty"
                    value={recipe.difficulty?.code || ""}
                    onChange={handleChange}
                >
                    <option value="">난이도를 선택하세요.</option>
                    {difficulties.map((difficulty) => (
                        <option key={difficulty.code} value={difficulty.code}>
                            {difficulty.title}
                        </option>
                    ))}
                </select>
                {/* 레시피 이미지 */}
                <input type="file" onChange={handleFileChange} className="recipe-file-input"/>


                {/* 재료 부분*/}
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="recipe-add-ingredient-button">
                    재료 추가
                </button>
                {
                    recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="recipe-ingredient-item">
                            <span>{ingredient.ingredientName}</span>
                            <input type="text" placeholder={ingredient.ingredientName}
                                   value={ingredient.ingredientDetailName}
                                   onChange={(e) => {
                                       const updatedIngredients = [...recipe.ingredients];
                                       updatedIngredients[index].ingredientDetailName = e.target.value;
                                       setRecipe({...recipe, ingredients: updatedIngredients});
                                   }} className="recipe-ingredient-input"/>
                            <input type="text" placeholder="재료 양(1개, 500g 등등 자유롭게)" value={ingredient.amount}
                                   onChange={(e) => {
                                       const updatedIngredients = [...recipe.ingredients];
                                       updatedIngredients[index].amount = e.target.value;
                                       setRecipe({...recipe, ingredients: updatedIngredients});
                                   }} className="recipe-ingredient-input"/>
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}>제거
                            </button>
                        </div>
                    ))}

                {/* 레시피 상세 부분*/}
                <button
                    type="button"
                    className="recipe-add-ingredient-button"
                    onClick={handleAddDetail}>
                    조리 순서 추가
                </button>
                {
                    recipe.recipeDetails.map((detail, index) => (
                        <div key={index} className="recipe-detail-item">
                            <span>Step {index + 1}</span>
                            <textarea
                                placeholder="입력해주세요"
                                value={detail.recipeDetailText}
                                onChange={(e) => {
                                    const updatedDetails = [...recipe.recipeDetails];
                                    updatedDetails[index].recipeDetailText = e.target.value;
                                    setRecipe({...recipe, recipeDetails: updatedDetails})
                                }} className="recipe-detail-input"/>
                            <span>이미지</span>
                            <input
                                type="file"
                                onChange={(e) => handleDetailFileChange(index, e.target.files[0])}
                                className="recipe-detail-file-input"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveDetail(index)}>제거
                            </button>
                        </div>
                    ))
                }

                {/* 레시피 추가 제출*/}
                <button type="submit" className="recipe-submit-button">레시피 추가</button>
            </form>

            {/* 재료 선택 모달 */}
            {isModalOpen && (
                <IngredientSelectionModal
                    ingredients={ingredientList}
                    onSelect={handleIngredientSelection}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default RecipeCreate;