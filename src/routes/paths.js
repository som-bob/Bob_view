const PATHS = {
    LOGIN: '/login',
    REGISTER: '/register',

    // 게시판
    BOARD_LIST: `/board`,
    BOARD_CREATE: `/board/add`,
    BOARD_DETAIL: (boardId) => `/board/${boardId}`,
    BOARD_EDIT: (boardId) => `/board/${boardId}/edit`,

    // 나의 냉장고
    REFRIGERATOR_DETAIL: `/refrigerator`,
};

export default PATHS;