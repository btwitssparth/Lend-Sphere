import axios from 'axios';

// Automatically switch between localhost (for testing) and the live backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://lend-sphere.onrender.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Crucial for cookies/tokens to work across domains
});

export default api;