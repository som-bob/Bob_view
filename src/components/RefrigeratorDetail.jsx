import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {
    addIngredientToRefrigerator,
    deleteAllIngredientToRefrigerator,
    deleteIngredientToRefrigerator,
    getRefrigerator
} from "../api/refrigerator.js";
import PATHS from "../routes/paths.js";
import IngredientAdd from "./IngredientAdd.jsx";
import RefrigeratorIngredients from "./RefrigeratorIngredients.jsx";

function RefrigeratorDetail() {
    const [refrigerator, setRefrigerator] = useState(null); // 나의 냉장고 정보
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [isConfirmVisible, setIsConfirmVisible] = useState(false); // 모두 삭제 확인 팝업 표시 여부
    const navigate = useNavigate();

    useEffect(() => {
        fetchRefrigerator();
    }, []);

    const fetchRefrigerator = useCallback(async () => {
        try {
            const response = await getRefrigerator()
            setRefrigerator(response.data);
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
            // alert("재료가 냉장고에 추가되었습니다.");
        } catch (error) {
            console.error("재료 추가 실패: ", error);
            alert("재료 추가에 실패했습니다.");
        }
    }

    const handleDeleteIngredient = async (refrigeratorIngredientId) => {
        try {
            const response = await deleteIngredientToRefrigerator(refrigerator.refrigeratorId, refrigeratorIngredientId);
            setRefrigerator(response.data); // 냉장고 정보 업데이트
            // alert("재료가 냉장고에서 삭제되었습니다.");
        } catch (error) {
            console.error("재료 삭제 실패: ", error);
            alert("재료 삭제에 실패했습니다.");
        }
    }

    const handleAllIngredient = async () => {
        try {
            const response = await deleteAllIngredientToRefrigerator(refrigerator.refrigeratorId);
            setRefrigerator(response.data); // 냉장고 정보 업데이트
        } catch (error) {
            console.error("모든 재료 삭제 실패: ", error);
            alert("모든 재료 삭제에 실패했습니다.");
        }
    }

    const handleConfirm = (isConfirmed) => {
        if (isConfirmed) {
            handleAllIngredient();
        }
        setIsConfirmVisible(false); // 팝업 닫기
    };

    const handleIngredientClick = (ingredient) => {
        setIsConfirmVisible(true); // 확인 팝업 표시
    };

    if (isLoading) {
        // 로딩 중 화면
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h2>{refrigerator.nickName}</h2>
            <div>
                <div>
                    <h3>냉장고 재료</h3>
                    <div>
                        <RefrigeratorIngredients
                            ingredients={refrigerator.ingredients}
                            onDeleteIngredient={handleDeleteIngredient}
                        />
                    </div>
                </div>
                <div>
                    <h3>재료 추가</h3>
                    <div>
                        <IngredientAdd
                            onAddIngredient={handleAddIngredient}
                        />
                    </div>
                </div>
                <div>
                    <button onClick={handleIngredientClick}>냉장고 비우기</button>
                </div>

                {isConfirmVisible && (
                    <>
                        <div className="overlay"></div>
                        <div className="confirm-dialog">
                            <p>모든 재료를 삭제하시겠습니까?</p>
                            <button onClick={() => handleConfirm(true)}>네</button>
                            <button onClick={() => handleConfirm(false)}>아니요</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RefrigeratorDetail;