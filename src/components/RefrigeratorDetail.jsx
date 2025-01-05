import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {addIngredientToRefrigerator, getRefrigerator} from "../api/refrigerator.js";
import PATHS from "../routes/paths.js";
import {getAllIngredient} from "../api/ingredient.js";
import IngredientAdd from "./IngredientAdd.jsx";

function RefrigeratorDetail() {
    const [refrigerator, setRefrigerator] = useState(null); // 나의 냉장고 정보
    const [allIngredient, setAllIngredient] = useState([]); // 모든 재료 정보
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitData();
    }, []);

    const fetchInitData = useCallback(async () => {
        try {
            const [refrigeratorResponse, ingredientResponse] = await Promise.all([
                getRefrigerator(),
                getAllIngredient()
            ]);
            setRefrigerator(refrigeratorResponse.data);
            setAllIngredient(ingredientResponse.data);
        } catch (error) {
            if (error.status === 400) {
                navigate(PATHS.REFRIGERATOR_ADD); // 냉장고 만들기 페이지로 이동
            } else {
                console.error("데이터 조회 실패: ", error);
            }
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    }, [navigate]);

    const handleAddIngredient = async (ingredientId, addedDate) => {
        try {
            const response = await addIngredientToRefrigerator(refrigerator.refrigeratorId, ingredientId, addedDate);
            setRefrigerator(response.data); // 냉장고 정보 업데이트
            alert("재료가 냉장고에 추가되었습니다.");
        } catch (error) {
            console.error("재료 추가 실패: ", error);
            alert("재료 추가에 실패했습니다.");
        }
    }

    const renderIngredients = (ingredients) => {
        if (!ingredients || ingredients.length === 0) {
            return <div>냉장고가 비어 있어요!</div>;
        }

        return ingredients.map((ingredient) => (
            <div key={ingredient.ingredientId}>
                <p>{ingredient.ingredientName}</p>
                <p>{ingredient.addedDate}</p>
                <div>
                    <button>재료 삭제</button>
                </div>
            </div>
        ));
    };

    if (isLoading) {
        // 로딩 중 화면
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h2>{refrigerator.nickName}</h2>
            <div>
                <h3>냉장고 재료</h3>
                <div>{renderIngredients(refrigerator.ingredients)}</div>
                <IngredientAdd
                    allIngredient={allIngredient}
                    onAddIngredient={handleAddIngredient}
                />
                <div>
                    <button>냉장고 비우기</button>
                </div>
            </div>
        </div>
    );
}

export default RefrigeratorDetail;