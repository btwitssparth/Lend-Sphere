import api from './axios';

export const sendMessage= async(rentalId,text)=>{
    return api.post('/messages/send',{rentalId,text});

}

export const getMessages=async(rentalId)=>{
    return api.post(`/messages/${rentalId}`);
};