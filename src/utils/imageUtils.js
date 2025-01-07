// src/utils/imageUtils.js

import defaultImgredientImage from '../assets/images/default_ingredient_image.png';

/**
 * 이미지 URL이 null 또는 빈 값일 경우 기본 이미지를 반환합니다.
 * @param {string|null} imageUrl - 원본 이미지 URL
 * @returns {string} 유효한 이미지 URL
 */
export function getDefaultIngredientImage(imageUrl) {
    return imageUrl || defaultImgredientImage;
}