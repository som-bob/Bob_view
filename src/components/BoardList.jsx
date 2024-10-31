import React, { useEffect, useState } from 'react';
import { getBoardList } from '../api/board';
import { useNavigate } from 'react-router-dom';
import './boardList.css';

function BoardList() {
    const [boards, setBoards] = useState([]); // 게시글 목록
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const navigate = useNavigate();

    // 페이지 번호에 따라 게시글 목록을 가져오는 함수
    const fetchBoardList = async (page) => {
        try {
            const response = await getBoardList(page); // 페이지 번호에 따라 요청
            const { content, totalPages } = response.data;
            setBoards(content); // 게시글 데이터 설정
            setTotalPages(totalPages); // 전체 페이지 수 설정
        } catch (error) {
            console.error('게시글 목록을 불러오는 데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchBoardList(currentPage); // 컴포넌트 마운트 시 첫 페이지 게시글 목록 로드
    }, [currentPage]);

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage); // 페이지 상태 업데이트
        }
    };

    const handleBoardClick = (boardId) => {
        navigate(`/board/${boardId}`); // 게시글 상세 페이지로 이동
    };

    return (
        <div className="board-list-container">
            <h2>게시판</h2>
            <ul className="board-list">
                {boards.map((board) => (
                    <li key={board.boardId} onClick={() => handleBoardClick(board.boardId)} className="board-item">
                        <h3>{board.boardTitle}</h3>
                        <p>작성자: {board.regId}</p>
                        <p>작성일: {board.regDate}</p>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    이전 페이지
                </button>
                <span>
          페이지 {currentPage + 1} / {totalPages}
        </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                    다음 페이지
                </button>
            </div>
        </div>
    );
}

export default BoardList;
