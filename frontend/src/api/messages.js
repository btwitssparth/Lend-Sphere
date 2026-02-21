import api from './axios';

export const sendMessage = async(rentalId, text) => {
    return api.post('/messages/send', {rentalId, text});
}

export const getMessages = async(rentalId) => {
    return api.get(`/messages/${rentalId}`); // 🔥 CHANGED FROM .post TO .get
};