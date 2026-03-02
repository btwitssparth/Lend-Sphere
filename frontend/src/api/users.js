import api from './axios';

// Fetch public profile data (user info, products, reviews)
export const getUserProfile = async (userId) => {
    return api.get(`/users/profile/${userId}`);
};
export const toggleWishlist = async (productId) => {
    return api.post('/users/wishlist/toggle', { productId });
};

export const getWishlist = async () => {
    return api.get('/users/wishlist');
};