import api from './axios';

export const askChatbot = async (message) => {
    return api.post('/chat/ask', { message });
};