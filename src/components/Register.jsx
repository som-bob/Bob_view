import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {register} from "../api/auth.js";
import './register.css';

/* 회원가입 화면 */
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 풀 동작 방지
        try {
            const data = await register(email, password, nickName);
            alert('회원가입 성공!')
            console.log(data);  // 회원가입 후 데이터 확인
            navigate('/login');
        } catch (error) {
            if(error.response && error.response.status === 400) {
                // 400 에러 시 백엔드에서 받은 errorMessage를 상태에 저장
                alert(error.response.data.errorMessage);
            } else {
                alert('회원가입 실패');
            }
        }
    }

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <form
                className="register-form"
                onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Register;
