import axios from "axios";

// Using env variable for the API URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

// Configure axios to always send cookies
axios.defaults.withCredentials = true;

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data.data;
};

export const logoutUser = async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data.data;
};

export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data.data;
};

// --- NEW FUNCTION ---
export const googleLoginUser = async (credential) => {
  const response = await axios.post(`${API_URL}/google-login`, { 
    credential 
  });
  return response.data.data;
};