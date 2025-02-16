import {useState} from 'react';
import './layout.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import BoardCreate from "./board/BoardCreate.jsx";
import BoardDetail from "./board/BoardDetail.jsx";
import BoardList from "./board/BoardList.jsx";
import PATHS from "../routes/paths.js";
import BoardEdit from "./board/BoardEdit.jsx";
import RefrigeratorDetail from "./refrigerator/RefrigeratorDetail.jsx";
import RefrigeratorCreate from "./refrigerator/RefrigeratorCreate.jsx";
import RecipeList from "./recipe/RecipeList.jsx";
import RecipeDetail from "./recipe/RecipeDetail.jsx";
import RecipeCreate from "./recipe/RecipeCreate.jsx";

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
        switch (menu) {
            case 'board': {
                // 게시판 목록 경로
                navigate(PATHS.BOARD_LIST);
                break;
            }
            case 'refrigerator' : {
                // 냉장고 상세 조회로 이동
                navigate(PATHS.REFRIGERATOR_DETAIL);
                break;
            }
            case 'recipe' : {
                // 레시피 리스트로 이동
                navigate(PATHS.RECIPE_LIST);
                break;
            }
            default : {
                setActiveMenu('welcome');
                break;
            }
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
                    <li
                        className={activeMenu === 'refrigerator' ? 'active' : ''}
                        onClick={() => changeActiveMenu('refrigerator')}
                    >
                        나의 냉장고
                    </li>
                    <li
                        className={activeMenu === 'recipe' ? 'active': ''}
                        onClick={() => changeActiveMenu('recipe')}
                    >
                        레시피
                    </li>
                </ul>
                <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
            </nav>

            {/* 메인 컨텐츠 영역 */}
            <main className="main-content">
                <Routes>
                    {/*게시판 영역*/}
                    <Route path="/board" element={<PrivateRoute element={BoardList}/>}/>
                    <Route path="/board/add" element={<PrivateRoute element={BoardCreate}/>}/>
                    <Route path="/board/:boardId" element={<PrivateRoute element={BoardDetail}/>}/>
                    <Route path="/board/:boardId/edit" element={<PrivateRoute element={BoardEdit}/>}/>

                    {/*나의 냉장고 관리 영역*/}
                    <Route path="/refrigerator" element={<PrivateRoute element={RefrigeratorDetail}/>}/>
                    <Route path="/refrigerator/add" element={<PrivateRoute element={RefrigeratorCreate}/>}/>

                    {/* 레시피 영역 */}
                    <Route path="/recipe" element={<PrivateRoute element={RecipeList} />} />
                    <Route path="/recipe/:recipeId" element={<PrivateRoute element={RecipeDetail} />} />
                    <Route path="/recipe/add" element={<PrivateRoute element={RecipeCreate} />} />



                </Routes>
            </main>
        </div>
    );
}

export default Layout;
