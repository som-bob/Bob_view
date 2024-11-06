const BASE_PATH = '/main';

const PATHS = {
    LOGIN: '/',
    REGISTER: '/register',
    BOARD_LIST: `${BASE_PATH}/board`,
    BOARD_CREATE: `${BASE_PATH}/board/add`,
    BOARD_DETAIL: (boardId) => `${BASE_PATH}/board/${boardId}`,
};

export default PATHS;