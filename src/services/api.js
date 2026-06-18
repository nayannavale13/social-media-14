import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all users from JSONPlaceholder.
 */
export async function fetchUsers() {
  const response = await apiClient.get('/users');
  return response.data;
}

/**
 * Fetch all posts from JSONPlaceholder.
 */
export async function fetchPosts() {
  const response = await apiClient.get('/posts');
  return response.data;
}

/**
 * Fetch comments for a specific post.
 * @param {number|string} postId - ID of the post.
 */
export async function fetchComments(postId) {
  const response = await apiClient.get(`/comments`, {
    params: { postId },
  });
  return response.data;
}
