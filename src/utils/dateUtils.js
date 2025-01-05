// src/utils/dateUtils.js

// 날짜를 yyyy-MM-dd 형식으로 변환하는 함수
export const formatDate = (date) => {
    if(!date) return '';

    const dateInfo = new Date(date);
    const year = dateInfo.getFullYear();
    const month = String(dateInfo.getMonth() + 1).padStart(2, '0');
    const day = String(dateInfo.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 오늘 날짜를 yyyy-MM-dd 형식으로 가져오는 함수
export const getTodayDate = () => {
    return formatDate(new Date());
}