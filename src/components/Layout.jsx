import React, {useState} from 'react';
import './layout.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import BoardCreate from "./BoardCreate.jsx";
import BoardDetail from "./BoardDetail.jsx";
import BoardList from "./BoardList.jsx";
import PATHS from "../routes/paths.js";
import BoardEdit from "./BoardEdit.jsx";

function Layout() {
    const [activeMenu, setActiveMenu] = useState('welcome'); // 현재 선택된 메뉴
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // accessToken 삭제
        localStorage.removeItem('email');
        localStorage.removeItem('refreshToken');
        navigate(PATHS.LOGIN);  // 로그인 페이지로 리다이렉트
    }

    // 상단 메뉴 클릭 시 메뉴에 따른 경로 이동
    const changeActiveMenu = (menu) => {
        setActiveMenu(menu); // 활성화된 메뉴 설정
        if (menu === 'board') {
            navigate(PATHS.BOARD_LIST); // '게시판' 클릭 시 게시판 목록 경로
        }
    };

    return (
        <div className="layout-container">
            {/* 상단 메뉴바 */}
            <nav className="top-menu">
                <ul className="menu-items">
                    <li
                        className={activeMenu === 'board' ? 'active' : ''}
                        onClick={() => changeActiveMenu('board')}
                    >
                        게시판
                    </li>
                    <li>
                        준비중
                    </li>
                </ul>
                <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
            </nav>

            {/* 메인 컨텐츠 영역 */}
            <main className="main-content">
                <Routes>
                    <Route path="/board" element={<PrivateRoute element={BoardList}/>}/>
                    <Route path="/board/add" element={<PrivateRoute element={BoardCreate}/>}/>
                    <Route path="/board/:boardId" element={<PrivateRoute element={BoardDetail}/>}/>
                    <Route path="/board/:boardId/edit" element={<PrivateRoute element={BoardEdit}/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default Layout;
