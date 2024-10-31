import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BoardList from './components/BoardList';
import BoardDetail from "./components/BoardDetail.jsx"; // 게시글 목록 컴포넌트
import PrivateRoute from "./components/PrivateRoute.jsx";

/* 전체 어플리케이션의 라우팅 설정 */
function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            {/* PrivateRoute 사용하여 로그인이 필요한 페이지 보호 */}
            <Route path="/boards" element={<PrivateRoute element={BoardList} />}/>
            <Route path="/board/:boardId" element={<PrivateRoute element={BoardDetail} />}/>
        </Routes>
    );
}

export default App;