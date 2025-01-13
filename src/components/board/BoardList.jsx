import React, { useEffect, useState, useCallback } from 'react';
import { getBoardList } from '../../api/board.js';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils.js';
import './BoardList.css';
import PATHS from "../../routes/paths.js";

function BoardList() {
    const [boards, setBoards] = useState([]); // 게시글 목록
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

    // 검색 상태
    const [searchParams, setSearchParams] = useState({
        boardTitle: '',
        boardContent: '',
        regDateStart: '',
        regDateEnd: ''
    });

    const navigate = useNavigate();

    // 게시글 목록을 가져오는 함수 (비동기 호출)
    const fetchBoardList = useCallback(async (page = 0) => {
        try {
            const formattedSearchParams = {
                ...searchParams,
                regDateStart: formatDate(searchParams.regDateStart),
                regDateEnd: formatDate(searchParams.regDateEnd),
            };

            const response = await getBoardList(page, formattedSearchParams);
            const { content, totalPages } = response.data;
            setBoards(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('게시글 목록을 불러오는 데 실패했습니다:', error);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchBoardList(currentPage); // 페이지 변경 시 게시글 로드
    }, [currentPage, fetchBoardList]);

    // 검색 조건 변경 핸들러
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value
        }));
    };

    // 검색 실행
    const handleSearch = () => {
        setCurrentPage(0); // 첫 페이지로 초기화
        fetchBoardList(0);
    };

    // 검색 필드에서 엔터 키를 누르면 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // 페이지 번호 목록 생성
    const getPageNumbers = () => {
        const range = 2; // 현재 페이지를 기준으로 표시할 페이지 수
        const startPage = Math.max(0, currentPage - range);
        const endPage = Math.min(totalPages - 1, currentPage + range);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    // 게시글 추가 페이지로 이동
    const handleAddBoard = () => navigate(PATHS.BOARD_CREATE);

    // 게시글 상세 페이지로 이동
    const handleBoardClick = (boardId) => navigate(PATHS.BOARD_DETAIL(boardId));

    return (
        <div className="board-list-container">
            <h2>게시판</h2>

            {/* 검색 필드 */}
            <SearchFields
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleAddBoard} className="add-board-button">추가</button>

            <ul className="board-list">
                {boards.map((board) => (
                    <BoardItem key={board.boardId} board={board} onClick={() => handleBoardClick(board.boardId)} />
                ))}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                getPageNumbers={getPageNumbers}
            />

        </div>
    );
}

export default BoardList;

// 검색 필드 컴포넌트
function SearchFields({ searchParams, onSearchChange, onSearch, onKeyDown }) {
    return (
        <div className="search-container">
            <input
                type="date"
                name="regDateStart"
                value={searchParams.regDateStart}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="등록 시작일"
            />
            <input
                type="date"
                name="regDateEnd"
                value={searchParams.regDateEnd}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="등록 종료일"
            />
            <input
                type="text"
                name="boardTitle"
                value={searchParams.boardTitle}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="제목"
            />
            <input
                type="text"
                name="boardContent"
                value={searchParams.boardContent}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                placeholder="내용"
            />
            <button onClick={onSearch}>검색</button>
        </div>
    );
}

// 게시글 아이템 컴포넌트
function BoardItem({ board, onClick }) {
    return (
        <li onClick={onClick} className="board-item">
            <h3>{board.boardTitle}</h3>
            <p>작성자: {board.regId}</p>
            <p>작성일: {board.regDate}</p>
        </li>
    );
}

// 페이지네이션 컴포넌트
function Pagination({ currentPage, totalPages, onPageChange, getPageNumbers }) {
    return (
        <div className="pagination">
            <button onClick={() => onPageChange(0)} disabled={currentPage === 0}>
                첫 페이지로
            </button>
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`page-number ${page === currentPage ? 'active' : ''}`}
                >
                    {page + 1}
                </button>
            ))}
            <button onClick={() => onPageChange(totalPages - 1)} disabled={currentPage === totalPages - 1}>
                마지막 페이지로
            </button>
        </div>
    );
}
