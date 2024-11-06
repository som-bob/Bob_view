/* 게시글 및 댓글 관련 API 호출 */

// 백엔드 API URL 설정
import axiosInstance from "./axiosInstance.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 게시글 목록 조회
export const getBoardList = async (page, searchParams) => {
    try {
        const pageSize = 5; // 페이지당 게시글 수

        // 검색 파라미터를 URL 쿼리로 변환
        const params = new URLSearchParams({
            page,
            size: pageSize,
            ...searchParams // 검색 조건 추가
        });

        const response = await axiosInstance.get(`${API_BASE_URL}/board?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.log('게시글 목록 조회 실패: ', error);
        throw error;
    }
};

// 특정 게시글 조회
export const getBoard = async (boardId) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/board/${boardId}`);
        return response.data;
    } catch (error) {
        console.log('게시글 조회 실패: ', error);
        throw error;
    }
};

// 게시글 생성
export const addBoard = async (title, content) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/board`, {
            title,
            content
        });
        return response.data;
    } catch (error) {
        console.log('게시글 조회 실패: ', error);
        throw error;
    }
};

// 게시글 삭제
export const deleteBoard = async (boardId) => {
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/board/${boardId}`);
        return response.data;
    } catch (error) {
        console.log('게시글 삭제 실패: ', error);
        throw error;
    }
}

// 댓글 생성
export const addComment = async (boardId, comment) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/board/${boardId}/comment`, {
            comment
        });
        return response.data;
    } catch (error) {
        console.log('댓글 생성 실패: ', error);
        throw error;
    }
}

// 댓글 삭제
export const deleteComment = async (commentId) => {
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/board/comment/${commentId}`);
        return response.data;
    } catch (error) {
        console.log('게시글 삭제 실패: ', error);
        throw error;
    }
}
