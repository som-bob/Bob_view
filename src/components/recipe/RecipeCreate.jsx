import {useNavigate} from "react-router-dom";
import {addRecipe} from "../../api/recipe";
import {useState} from "react";

function RecipeCreate() {
    const navigate = useNavigate();
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

    const handleRecipeChange = (e) => {
        const {name, value} = e.target;
        setRecipe({ ...recipe, [name]: value });
    }

    const handleRecipeFileChange = (e) => {
        setRecipe({ ...recipe, recipeFile: e.target.file[0] });
    }

    const handleAddDetail = () => {
        setRecipe({
            ...recipe,
            recipeDetails: [...recipe.recipeDetails, {recipeDetailText: "", recipeDetailFile: null}]
        });
    }

    const handleRemoveDetail = (index) => {
        const updateDetails = recipe.recipeDetails.filter((_, i) => i !== index);
        setRecipe({ ...recipe, recipeDetails: updateDetails });
    }

    const handleDetailChange = (index, field, value) => {
        const updateDetails = [...recipe.recipeDetails];
        updateDetails[index][field] = value;
        setRecipe({ ...recipe, recipeDetails: updateDetails });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(recipe).forEach((key) => {
            if (key === "recipeFile" && recipe[key]) {
                formData.append(key, recipe[key]);
            } else if (key === "recipeDetails") {
                recipe.recipeDetails.forEach((detail, index) => {
                    formData.append(`recipeDetails[${index}].recipeDetailText`, detail.recipeDetailText);
                    if (detail.recipeDetailFile) {
                        formData.append(`recipeDetails[${index}].recipeDetailFile`, detail.recipeDetailFile);
                    }
                });
            }
            // 재료에 대한 부분이 바뀌어야 될 수도 있음
            else if (Array.isArray(recipe[key])) {
                formData.append(key, JSON.stringify(recipe[key]));
            } else {
                formData.append(key, recipe[key]);
            }
        });

        try {
            const response = await addRecipe(formData);
            const recipeId = Number(response.data);
            alert("레시피를 성공적으로 저장했습니다.");
            navigate(`/recipes/${recipeId}`);
        } catch (error) {
            const responseData = error.response.data;
            if (error.status === 400) {
                alert(responseData.errorMessage);
            } else {
                alert("레시피 추가에 실패했습니다.");
            }
        }
    }

    // 재료 추가에 대한 부분이 없음

    return (
        <div>레시피 추가</div>
    );
}

export default RecipeCreate;