import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {register} from "../api/auth.js";
import './register.css';

/* 회원가입 화면 */
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 풀 동작 방지
        try {
            await register(email, password, nickName);
            setIsRegister(true);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // 400 에러 시 백엔드에서 받은 errorMessage를 상태에 저장
                alert(error.response.data.errorMessage);
            } else {
                alert('회원가입 실패');
            }
        }
    }

    return (
        <div className="register-container">
            {
                isRegister ? (
                    <div className="success-message">
                        <h2>회원가입이 완료되었습니다.</h2>
                        <button
                            onClick={() => navigate('/login')}
                            className="login-button"
                        >로그인 하러가기
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>회원가입</h2>
                        <form onSubmit={handleSubmit} className="register-form">
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
                        <button
                            onClick={() => navigate('/login')}
                            className="login-button"
                        >
                            돌아가기
                        </button>
                    </>
                )}
        </div>
    );
}

export default Register;
