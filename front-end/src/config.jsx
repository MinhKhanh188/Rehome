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

 // Post endpoints
  CREATE_POST: `${baseUrl}/api/posts/createPost`,
  GET_ALL_CATEGORY: `${baseUrl}/api/posts/getListCategories`
};