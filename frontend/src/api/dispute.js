import api from './axios';

export const createDispute = async (formData) => {
    return api.post('/disputes/create', formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// 🔥 Add this function!
export const getMyDisputes = async () => {
    return api.get('/disputes/my-disputes');
};

export const getDisputeByRental = async (rentalId) => {
    return api.get(`/disputes/rental/${rentalId}`);
};

export const getDisputesAgainstMe = async () => {
    return api.get('/disputes/against-me');
};

export const submitDisputeResponse = async (disputeId, formData) => {
    return api.post(`/disputes/${disputeId}/respond`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};