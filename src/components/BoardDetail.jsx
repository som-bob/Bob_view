import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addComment, deleteBoard, deleteComment, getBoard, updateComment} from "../api/board.js";
import './boardDetail.css';
import Paths from "../routes/paths.js";

function BoardDetail() {
    const {boardId} = useParams();
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");

    const [board, setBoard] = useState(null); // 게시글 데이터
    const [error, setError] = useState(null); // 에러 상태
    const [newComment, setNewComment] = useState(''); // 새 댓글
    const [editingComment, setEditingComment] = useState({id: null, content: ''}); // 댓글 수정 상태
    const [replyingComment, setReplyingComment] = useState({id: null, content: ''}); // 대댓글 상태

    useEffect(() => {
        fetchBoardDetail();
    }, [boardId]);

    const fetchBoardDetail = async () => {
        try {
            const response = await getBoard(boardId);
            setBoard(response.data);
        } catch (error) {
            console.error('게시글 정보를 불러오는 데 실패했습니다:', error);
            setError('게시글 정보를 불러오는 데 실패했습니다.');
        }
    };

    // 공통 API 처리기
    const handleApiCall = async (apiFunc, successMessage, resetFields) => {
        try {
            await apiFunc();
            if (successMessage) alert(successMessage);
            if (resetFields) resetFields();
            await fetchBoardDetail(); // 데이터 재로드
        } catch (error) {
            console.error('작업 실패:', error);
            alert('작업에 실패했습니다.');
        }
    };

    // 댓글 추가 핸들러
    const handleAddComment = () => {
        if (!newComment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }
        handleApiCall(
            () => addComment(boardId, null, newComment),
            null,
            () => setNewComment('')
        );
    };

    // 대댓글 추가 핸들러
    const handleAddReply = (parentCommentId) => {
        if (!replyingComment.content.trim()) {
            alert('대댓글을 입력해주세요.');
            return;
        }
        handleApiCall(
            () => addComment(boardId, parentCommentId, replyingComment.content),
            null,
            () => setReplyingComment({id: null, content: ''})
        );
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
        handleApiCall(() => deleteComment(commentId));
    };

    // 댓글 수정 저장 핸들러
    const handleSaveCommentEdit = (commentId) => {
        if (!editingComment.content.trim()) {
            alert('수정 내용을 입력해주세요.');
            return;
        }
        handleApiCall(
            () => updateComment(commentId, editingComment.content),
            '댓글이 수정되었습니다.',
            () => setEditingComment({id: null, content: ''})
        );
    };

    // 게시글 삭제 핸들러
    const handleDeleteBoard = () => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
        handleApiCall(
            () => deleteBoard(boardId),
            '게시글이 삭제되었습니다.',
            () => navigate(Paths.BOARD_LIST));
    };

    // 댓글 트리 렌더링
    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
                <p><strong>{comment.regId}</strong></p>
                {editingComment.id === comment.commentId ? (
                    <>
                        <textarea
                            value={editingComment.content}
                            onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
                        />
                        <button onClick={() => handleSaveCommentEdit(comment.commentId)}>저장</button>
                        <button onClick={() => setEditingComment({id: null, content: ''})}>취소</button>
                    </>
                ) : (
                    <>
                        <p>{comment.content}</p>
                        <p>작성일: {comment.regDate}</p>
                        {userEmail === comment.regId && !comment.delete && (
                            <div className="comment-actions">
                                <button onClick={() => setEditingComment({
                                    id: comment.commentId,
                                    content: comment.content
                                })}>수정
                                </button>
                                <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                            </div>
                        )}
                    </>
                )}
                {!comment.delete && (
                    <div className="reply-input">
                        <button onClick={() => setReplyingComment({id: comment.commentId, content: ''})}>대댓글</button>
                    </div>
                )}
                {replyingComment.id === comment.commentId && (
                    <div className="reply-input">
                        <textarea
                            value={replyingComment.content}
                            onChange={(e) => setReplyingComment({...replyingComment, content: e.target.value})}
                            placeholder="댓글을 입력하세요."
                        />
                        <button onClick={() => handleAddReply(comment.commentId)}>추가</button>
                        <button onClick={() => setReplyingComment({id: null, content: ''})}>취소</button>
                    </div>
                )}
                {comment.subComments.length > 0 && (
                    <div className="sub-comments">{renderComments(comment.subComments)}</div>
                )}
            </div>
        ));
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!board) {
        return <div>로딩 중...</div>; // board가 null일 경우 로딩 메시지 표시
    }

    return (
        <div className="board-detail-container">
            <div className="board-actions-top">
                {userEmail === board.regId && !board.delete && (
                    <>
                        <button onClick={() => navigate(Paths.BOARD_EDIT(boardId))}>수정</button>
                        <button onClick={handleDeleteBoard}>삭제</button>
                    </>
                )}
                <button onClick={() => navigate(Paths.BOARD_LIST)}>목록</button>
            </div>

            <h2>{board.title}</h2>
            <p>작성자: {board.regId}</p>
            <p>작성일: {board.regDate}</p>
            <div className="board-content">{board.content}</div>

            <div className="comments-section">
                <h3>댓글</h3>
                {renderComments(board.commentList)}
                {!board.delete && (
                    <div className="add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                        ></textarea>
                        <button onClick={handleAddComment}>댓글 추가</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BoardDetail;
