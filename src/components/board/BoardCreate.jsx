import {useState} from "react";
import './boardCreate.css';
import {useNavigate} from "react-router-dom";
import {addBoard} from "../../api/board.js";
import PATHS from "../../routes/paths.js";

function BoardCreate() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleCreatePost = async () => {
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await addBoard(title, content); // boardId를 추출하여 사용
            const boardId = Number(response.data);
            navigate(PATHS.BOARD_DETAIL(boardId)); // 절대 경로로 설정
        } catch (error) {
            console.error('게시글 추가 실패:', error);
            alert('게시글 추가에 실패했습니다.');
        }
    }

    return (
        <div className="board-create-container">
            <h2>게시글 추가</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>내용</label>
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
                <button type="button" onClick={handleCreatePost}>
                    추가
                </button>
            </form>
        </div>
    );
}

export default BoardCreate;