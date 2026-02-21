import api from './axios';

// Submit a new review
export const addReview = async (reviewData) => {
    return api.post('/reviews/add', reviewData);
};

// Get all reviews for a specific product
export const getProductReviews = async (productId) => {
    return api.get(`/reviews/product/${productId}`);
};