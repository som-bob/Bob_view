import {useNavigate} from "react-router-dom";
import {useState} from "react";
import PATHS from "../routes/paths.js";
import {createRefrigerator} from "../api/refrigerator.js";

function RefrigeratorCreate () {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");
    const [nickName, setNickName] = useState(userEmail + "님의 냉장고");

    const handleCreateRefrigerator = async () => {
        if(! nickName) {
            alert('냉장고 이름을 입력해주세요.');
            return;
        }

        try {
            await createRefrigerator(nickName);
            navigate(PATHS.REFRIGERATOR_DETAIL);
        } catch (error) {
            alert("냉장고 생성에 실패 했습니다. 잠시후 시도 해주세요.")
        }
    }

    return (
        <div>
            <h2>나의 냉장고</h2>
            <div>
                <input type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                       placeholder="냉장고 이름을 적어주세요."
                />
                <button type="button" onClick={handleCreateRefrigerator}>냉장고 생성</button>
            </div>
        </div>
    );
}

export default RefrigeratorCreate;