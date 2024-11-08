const PATHS = {
    LOGIN: '/login',
    REGISTER: '/register',
    BOARD_LIST: `/board`,
    BOARD_CREATE: `/board/add`,
    BOARD_DETAIL: (boardId) => `/board/${boardId}`,
    BOARD_EDIT: (boardId) => `/board/${boardId}/edit`,
};

export default PATHS;