import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import PrivateRoute from "./components/PrivateRoute.jsx";

/* 전체 어플리케이션의 라우팅 설정 */
function App() {
    return (
        <Routes>
            {/* PrivateRoute 사용하여 로그인이 필요한 페이지 보호 */}
            <Route path="/*" element={<PrivateRoute element={Layout}/>}/> {/* 로그인 후 메인 화면 */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    );
}

export default App;