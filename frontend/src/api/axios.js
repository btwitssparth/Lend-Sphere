import axios from 'axios';

// Automatically switch between localhost (for testing) and the live backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://lend-sphere.onrender.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Crucial for cookies/tokens to work across domains
});

// Response Interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh the token
                await axios.post(`${BASE_URL}/users/refresh-token`, {}, { withCredentials: true });
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the user is truly unauthorized
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;