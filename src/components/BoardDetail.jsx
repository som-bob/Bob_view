/* 게시글 상세 조회 화면 */
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addComment, deleteBoard, deleteComment, getBoard} from "../api/board.js";
import './boardDetail.css';
import Paths from "../routes/paths.js";

function BoardDetail() {
    const {boardId} = useParams();  // url에서 boardId 추출
    const [board, setBoard] = useState(null);   // 게시글 데이터 저장
    const [error, setError] = useState(null);   // 에러 상태 저장
    const [newComment, setNewComment] = useState('');   // 새 댓글 상태
    const userEmail = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoardDetail();
    }, [boardId]);

    const fetchBoardDetail = async () => {
        try {
            const response = await getBoard(boardId);
            setBoard(response.data);
        } catch (error) {
            console.error('게시글 정보를 불러오는 데 실패했습니다:', err);
            setError('게시글 정보를 불러오는 데 실패했습니다.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>
    }

    if (!board) {
        return <div>로딩 중...</div>
    }

    // 댓글 트리 렌더링
    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
                <p><strong>{comment.regId}</strong></p>
                <p>{comment.content}</p>
                <p>작성일: {comment.regDate}</p>

                {userEmail === comment.regId
                    && ! comment.delete
                    && (
                        <div className="comment-actions">
                            <button>수정</button>
                            <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                        </div>
                    )}

                {/* 대댓글 재귀 렌더링 */}
                {comment.subComments.length > 0 && (
                    <div className="sub-comments">
                        {renderComments(comment.subComments)}
                    </div>
                )}
            </div>
        ));
    };

    // 댓글 추가 핸들러
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('댓글을 입력해주세요.')
            return;
        }

        try {
            await addComment(boardId, newComment);
            setNewComment('');  // 입력 필드 초기화
            await fetchBoardDetail();
        } catch (error) {
            console.error(error);
            alert("댓글 추가에 실패했습니다.")
        }
    }

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteComment(commentId);
            await fetchBoardDetail();
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    }

    // 게시글 삭제
    const handleDeleteBoard = async () => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteBoard(boardId);
            await fetchBoardDetail();
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    }

    return (
        <div className="board-detail-container">
            {/* 상단 액션 버튼 */}
            <div className="board-actions-top">
                {userEmail === board.regId
                    && ! board.delete
                    && (
                    <>
                        <button>수정</button>
                        <button onClick={handleDeleteBoard}>삭제</button>
                    </>
                )}
                <button onClick={() => navigate(Paths.BOARD_LIST)}>목록</button> {/* 목록 버튼 */}
            </div>

            {/* 게시글 상세 정보 */}
            <h2>{board.title}</h2>
            <p>작성자: {board.regId}</p>
            <p>작성일: {board.regDate}</p>
            <div className="board-content">{board.content}</div>

            {userEmail === board.regId
                && ! board.delete
                && (
                    <div className="board-actions">
                        <button>수정</button>
                        <button onClick={() => handleDeleteBoard()}>삭제</button>
                    </div>
                )}

            {/* 댓글 리스트 */}
            <div className="comments-section">
                <h3>댓글</h3>
                {renderComments(board.commentList)}

                {/* 댓글 추가 */}
                <div className="add-comment">
                    {
                        board.delete ?
                            '' :
                            <div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 입력하세요"
                            ></textarea>
                                <button onClick={handleAddComment}>댓글 추가</button>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
        ;
}

export default BoardDetail;