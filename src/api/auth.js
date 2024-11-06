/* 로그인, 회원가입 API 호출 */

// 백엔드 API URL 설정
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 로그인 API
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/member/login`, {
            email,
            password
        });
        localStorage.setItem("email", email);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 회원 가입 API
export const register = async (email, password, nickName) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/member/join`, {
            email,
            password,
            nickName
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};