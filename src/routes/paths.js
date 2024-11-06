const BASE_PATH = '/main';


const PATHS = {
    LOGIN: '/login',
    REGISTER: '/register',
    BOARD_LIST: `/board`,
    BOARD_CREATE: `/board/add`,
    BOARD_DETAIL: (boardId) => `/board/${boardId}`,
};

export default PATHS;