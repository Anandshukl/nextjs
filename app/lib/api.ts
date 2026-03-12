const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API call failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// User API
export const userAPI = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (data: any) =>
    apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSettings: () => apiCall('/user/settings'),
  
  updateSettings: (data: any) =>
    apiCall('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getPosts: () => apiCall('/user/posts'),
  
  createPost: (title: string, content: string, category: string) =>
    apiCall('/user/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, category }),
    }),

  deletePost: (postId: number) =>
    apiCall(`/user/posts/${postId}`, {
      method: 'DELETE',
    }),
};
