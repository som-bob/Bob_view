/* 게시글 상세 조회 화면 */
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getBoard} from "../api/board.js";
import './boardDetail.css';

function BoardDetail(){
    const {boardId} = useParams();  // url에서 boardId 추출
    const [board, setBoard] = useState(null);   // 게시글 데이터 저장
    const [error, setError] = useState(null);   // 에러 상태 저장

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await getBoard(boardId);
                setBoard(response.data);
            } catch (error) {
                console.error('게시글 정보를 불러오는 데 실패했습니다:', err);
                setError('게시글 정보를 불러오는 데 실패했습니다.');
            }
        };

        fetchBoardDetail();
    }, [boardId]);

    if(error) {
        return <div className="error-message">{error}</div>
    }

    if(! board) {
        return <div>로딩 중...</div>
    }

    return (
        <div className="board-detail-container">
            <h2>{board.title}</h2>
            <p>작성자: {board.regId}</p>
            <p>작성일: {board.regDate}</p>
            <div className="board-content">{board.content}</div>
        </div>
    );
}

export default BoardDetail;