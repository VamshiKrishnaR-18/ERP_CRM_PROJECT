import axiosClient from './axiosClient';

export const userService = {
  // Register a new user
  register: async (userData) => {
    const response = await axiosClient.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axiosClient.post('/users/login', { email, password });
    return response.data;
  },

  // Logout user
  logout: async (userId) => {
    const response = await axiosClient.post(`/users/logout/${userId}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await axiosClient.get('/users/getUsers');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await axiosClient.get(`/users/getUser/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await axiosClient.delete(`/users/deleteUser/${userId}`);
    return response.data;
  },

  // Reactivate user
  reactivateUser: async (userId) => {
    const response = await axiosClient.patch(`/users/reactivate/${userId}`);
    return response.data;
  },

  // Reset password
  resetPassword: async (userId, newPassword) => {
    const response = await axiosClient.post(`/users/reset-password/${userId}`, { newPassword });
    return response.data;
  }
};

export default userService;

