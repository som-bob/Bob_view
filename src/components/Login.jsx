import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../api/auth.js";
import './login.css';

/* 로그인 화면 */
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 풀 동작 방지
        try {
            const response = await login(email, password);
            localStorage.setItem("email", email);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            navigate('/main');
        } catch (error) {
            alert('로그인 실패. 다시 시도해 주세요.')
            console.error('로그인 에러:', error);
        }
    }

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form className="login-form"
                  onSubmit={handleSubmit}>
                <input
                    placeholder="이메일"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">로그인</button>
            </form>
            <button
                className="register-button"
                onClick={() => navigate('/register')}
            >회원가입
            </button>
        </div>

    );
}

export default Login;