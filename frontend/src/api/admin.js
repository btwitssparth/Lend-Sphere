import api from './axios';

export const getAllDisputes = async () => {
    return api.get('/admin/disputes');
};

export const processDispute = async (disputeId, status, adminComment) => {
    return api.post(`/admin/dispute/${disputeId}/process`, { status, adminComment });
};