import React, { useState } from 'react';
import BoardList from './BoardList';
import './layout.css';
import {useNavigate} from "react-router-dom";
import BoardCreate from "./BoardCreate.jsx";
import BoardDetail from "./BoardDetail.jsx";

function Layout() {
    const [activeMenu, setActiveMenu] = useState('welcome'); // 현재 선택된 메뉴
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // accessToken 삭제
        navigate('/');  // 로그인 페이지로 리다이렉트
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'board':
                return <BoardList />;
            case 'boardCreate':
                return <BoardCreate/>;
            case 'boardDetail':
                return <BoardDetail/>;
            case 'welcome':
            default:
                return <div className="welcome-message">test</div>;
        }
    };

    return (
        <div className="layout-container">
            {/* 상단 메뉴바 */}
            <nav className="top-menu">
                <ul className="menu-items">
                    <li
                        className={activeMenu === 'board' ? 'active' : ''}
                        onClick={() => setActiveMenu('board')}
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
                {renderContent()}
            </main>
        </div>
    );
}

export default Layout;
