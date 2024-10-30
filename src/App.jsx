import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BoardList from './components/BoardList'; // 게시글 목록 컴포넌트

/* 전체 어플리케이션의 라우팅 설정 */
function App() {
    return (
        <Routes>
            <Route path="/" element={<BoardList/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    );
}

export default App;