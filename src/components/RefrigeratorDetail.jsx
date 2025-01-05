import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getRefrigerator} from "../api/refrigerator.js";

function RefrigeratorDetail() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");
    const [refrigerator, setRefrigerator] = useState(null); // 나의 냉장고 정보

    useEffect(() => {
        fetchRefrigeratorDetail();
    }, [userEmail]);

    const fetchRefrigeratorDetail = async () => {
        try {
            const response = await getRefrigerator();
            setRefrigerator(response.data);
        } catch (error) {
            console.log('조회 실패: ', error);
            if(error.status === 400) {
                // 400일 경우에 냉장고 만들기 페이지로 이동
                navigate('/refrigerator/add');
            }
        }
    }

    return(
        <div>나의 냉장고 상세</div>
    );
}

export default RefrigeratorDetail;