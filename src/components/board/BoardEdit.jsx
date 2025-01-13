import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getBoard, updateBoard} from "../../api/board.js";
import PATHS from "../../routes/paths.js";
import './boardDetail.css';


function BoardEdit() {
    const {boardId} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await getBoard(boardId);
                const {title, content} = response.data;
                setTitle(title);
                setContent(content);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
                alert('게시글을 불러오는데 실패했습니다.')
            }
        };
        fetchBoard();
    }, [boardId]);

    const handleUpdateBoard = async () => {
        if (!title || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            await updateBoard(boardId, title, content);
            alert('게시글이 수정되었습니다.')
            navigate(`${PATHS.BOARD_DETAIL(boardId)}`);
        } catch (error) {
            console.error('게시글 수정 실패: ', error);
            alert('게시글 수정에 실패했습니다.');
        }
    }

    return (
        <div className='board-edit-container'>
            <h2>게시글 수정</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요."
                    />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요."
                    />
                </div>
                <button type="button" onClick={handleUpdateBoard}>완료</button>
                <button type="button" onClick={() => navigate(`${PATHS.BOARD_DETAIL(boardId)}`)}>취소</button>
            </form>
        </div>
    );
}

export default BoardEdit;