import api from './axios';

export const createDispute = async (formData) => {
    return api.post('/disputes/create', formData);
    // Axios automatically sets multipart/form-data when it detects FormData
};

export const getMyDisputes = async () => {
    return api.get('/disputes/my-disputes');
};

export const getDisputeByRental = async (rentalId) => {
    return api.get(`/disputes/rental/${rentalId}`);
};

// Get disputes filed against the current user (renter)
export const getDisputesAgainstMe = async () => {
    return api.get('/disputes/against-me');
};

// 🔥 FIXED: Removed manual Content-Type header
// Submit response to a dispute (defendant's defense)
export const submitDisputeResponse = async (disputeId, formData) => {
    // Axios will automatically set Content-Type to multipart/form-data
    // when it detects FormData, including the correct boundary
    return api.post(`/disputes/${disputeId}/respond`, formData);
};