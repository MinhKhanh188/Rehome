// front-end/src/config.js

// API Configuration
const baseUrl = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_BACKEND_LOCAL_URL
  : process.env.REACT_APP_BACKEND_PRODUCTION_URL_DEV;



export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${baseUrl}/api/users/login`,
  REGISTER: `${baseUrl}/api/users/register`,
  FORGOT_PASSWORD: `${baseUrl}/api/users/forgotPassword`,
  RESET_PASSWORD: `${baseUrl}/api/users/resetPassword`,


  // User endpoints
  GET_USER_PROFILE: `${baseUrl}/api/users/profile`,
  GET_USER_POSTS: `${baseUrl}/api/posts/getPersonalPosts`,
  GET_ALL_USERS: `${baseUrl}/api/users/getAllUsers`,
  // Admin endpoints
  GET_UNVERIFIED_POSTS: `${baseUrl}/api/posts/unverifiedPosts`,
  GET_VERIFIED_POSTS: `${baseUrl}/api/posts/verifiedPosts`,
  VERIFY_POST: `${baseUrl}/api/posts/verify`,
  ADMIN_GET_POST_DETAIL: `${baseUrl}/api/posts/viewDetailPost`,

  // Post endpoints
  CREATE_POST: `${baseUrl}/api/posts/createPost`,
  GET_POST_BY_PROVINCE: `${baseUrl}/api/posts/province`,
  GET_POST_DETAIL_BY_ID: `${baseUrl}/api/posts/productDetail`,
  GET_ALL_VIP_POSTS: `${baseUrl}/api/posts/allVipPosts`,

  GET_ALL_CATEGORY: `${baseUrl}/api/posts/getListCategories`,
  GET_ALL_PROVINCE: `${baseUrl}/api/posts/getListProvinces`,


  // Message endpoints
  GET_MESSAGES: `${baseUrl}/api/messages/getMessages`,
  SEND_MESSAGE: `${baseUrl}/api/messages/sendMessage`,
  JOIN_CONVERSATION: `${baseUrl}/api/messages/createOrGetConversation`,
  GET_USER_CONVERSATIONS: `${baseUrl}/api/messages/getUserConversations`,
};

export const NAME_CONFIG = {
  TOKEN: 'Rehometoken',
  USER: 'Rehomeusers',
  USER_PROVINCE: 'Rehome_clientprovince'
}