import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipe } from "../../api/recipe.js";
import "./recipeDetail.css";

function RecipeDetail() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetchRecipe();
    }, [recipeId]);

    const fetchRecipe = async () => {
        try {
            const response = await getRecipe(recipeId);
            setRecipe(response.data);
        } catch (error) {
            console.error("레시피 조회에 실패했습니다.", error);
            alert("레시피 조회에 실패했습니다.");
        }
    };

    if (!recipe) {
        return <div>로딩 중...</div>;
    }

    const {
        recipeName,
        recipeDescription,
        servings,
        difficulty,
        cookingTime,
        recipeFileUrl,
        ingredients,
        details,
        regDate,
        regId
    } = recipe;

    return (
        <div className="recipe-detail">
            {/* 레시피 헤더 */}
            <div className="recipe-header">
                <img src={recipeFileUrl} alt={recipeName} className="recipe-image" />
                <div className="recipe-info">
                    <h1>{recipeName}</h1>
                    <p className="description">{recipeDescription}</p>
                    <ul className="meta-info">
                        <li><strong>난이도:</strong> {difficulty.title}</li>
                        <li><strong>소요 시간:</strong> {cookingTime}분</li>
                        <li><strong>인분:</strong> {servings}</li>
                    </ul>
                    <p className="created-by">
                        <strong>작성자:</strong> {regId} <strong>작성일:</strong> {regDate}
                    </p>
                </div>
            </div>

            {/* 재료 목록 */}
            <div className="recipe-ingredients">
                <h2>재료</h2>
                <ul>
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.recipeIngredientId}>
                            {ingredient.ingredientDetailName} - {ingredient.amount}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 레시피 단계 */}
            <div className="recipe-steps">
                <h2>조리 순서</h2>
                {details.map((detail) => (
                    <div key={detail.recipeDetailId} className="step">
                        <h3>Step {detail.recipeOrder}</h3>
                        {detail.recipeDetailFileUrl && (
                            <img
                                src={detail.recipeDetailFileUrl}
                                alt={`Step ${detail.recipeOrder}`}
                                className="step-image"
                            />
                        )}
                        <p>{detail.recipeDetailText}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeDetail;
