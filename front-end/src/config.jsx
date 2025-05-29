// front-end/src/config.js

// API Configuration
const baseUrl = 'http://localhost:9999';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${baseUrl}/api/users/login`,
  REGISTER: `${baseUrl}/api/users/register`,
  // FORGOT_PASSWORD: `${baseUrl}/api/users/forgot-password`,
  // RESET_PASSWORD: `${baseUrl}/api/users/reset-password`,


  // User endpoints
  GET_USER_PROFILE: `${baseUrl}/api/users/profile`,
  GET_USER_POSTS: `${baseUrl}/api/posts/getPersonalPosts`,

  // Post endpoints
  CREATE_POST: `${baseUrl}/api/posts/createPost`,
  GET_POST_BY_PROVINCE: `${baseUrl}/api/posts/province`,

  GET_ALL_CATEGORY: `${baseUrl}/api/posts/getListCategories`,
  GET_ALL_PROVINCE: `${baseUrl}/api/posts/getListProvinces`
};

export const NAME_CONFIG = {
  TOKEN: 'Rehometoken',
  USER: 'Rehomeusers',
  USER_PROVINCE: 'Rehome_clientprovince'
}