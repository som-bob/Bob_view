import React, { useEffect, useState } from 'react';
import { getBoardList } from '../api/board';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils'; // 날짜 형식 변환 함수 불러오기
import './boardList.css';

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

    // 페이지 번호와 검색 조건에 따라 게시글 목록을 가져오는 함수
    const fetchBoardList = async (page) => {
        try {
            // 날짜 형식 변환
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
    };

    useEffect(() => {
        fetchBoardList(currentPage); // 컴포넌트 마운트 시 첫 페이지 게시글 목록 로드
    }, [currentPage]);

    // 검색 조건 변경 핸들러
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value
        }));
    };

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = () => {
        // 첫 페이지부터 검색
        setCurrentPage(0);
        fetchBoardList(0);
    };

    // 검색 필드에서 엔터 키를 누르면 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // 검색 함수 호출
        }
    };

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage); // 페이지 상태 업데이트
        }
    };

    // 페이지 번호 목록 생성
    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // 게시글 추가 페이지로 이동하는 함수
    const handleAddBoard = () => {
        navigate('/home/board/add'); // 절대 경로로 수정
    };

    // 게시글 상세 페이지로 이동하는 함수
    const handleBoardClick = (boardId) => {
        navigate(`/home/board/${boardId}`); // 절대 경로로 수정
    };

    return (
        <div className="board-list-container">
            <h2>게시판</h2>

            {/* 검색 필드 */}
            <div className="search-container">
                <input
                    type="text"
                    name="boardTitle"
                    placeholder="제목"
                    value={searchParams.boardTitle}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // 엔터 키 감지
                />
                <input
                    type="text"
                    name="boardContent"
                    placeholder="내용"
                    value={searchParams.boardContent}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // 엔터 키 감지
                />
                <input
                    type="date"
                    name="regDateStart"
                    placeholder="등록 시작일"
                    value={searchParams.regDateStart}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // 엔터 키 감지
                />
                <input
                    type="date"
                    name="regDateEnd"
                    placeholder="등록 종료일"
                    value={searchParams.regDateEnd}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // 엔터 키 감지
                />
                <button onClick={handleSearch}>검색</button>
                <button onClick={handleAddBoard}>추가</button>
            </div>

            <ul className="board-list">
                {boards.map((board) => (
                    <li
                        key={board.boardId}
                        onClick={() => handleBoardClick(board.boardId)}
                        className="board-item"
                    >
                        <h3>{board.boardTitle}</h3>
                        <p>작성자: {board.regId}</p>
                        <p>작성일: {board.regDate}</p>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button onClick={() => handlePageChange(0)} disabled={currentPage === 0}>
                    첫 페이지로
                </button>
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`page-number ${page === currentPage ? 'active' : ''}`}
                    >
                        {page + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1}>
                    마지막 페이지로
                </button>
            </div>
        </div>
    );
}

export default BoardList;
