import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// Set auth token for requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Save user data to MongoDB
const saveUserData = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/save-user`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get current user data
const getCurrentUser = async (token) => {
  try {
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user data
const updateUser = async (userData, token) => {
  try {
    setAuthToken(token);
    const response = await axios.put(`${API_URL}/update`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { setAuthToken, saveUserData, getCurrentUser, updateUser };