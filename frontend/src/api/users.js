import api from './axios';

// Fetch public profile data (user info, products, reviews)
export const getUserProfile = async (userId) => {
    return api.get(`/users/profile/${userId}`);
};