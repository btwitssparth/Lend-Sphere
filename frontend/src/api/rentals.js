import api from './axios';

// 1. Renter: See items I have requested
export const getMyRentals = async () => {
    return api.get('/rentals/my-rentals');
};

// 2. Lender: See requests for MY products
export const getLenderRequests = async () => {
    return api.get('/rentals/lender/requests');
};

// 3. Lender: Approve or Reject a request
export const updateRentalStatus = async (rentalId, status) => {
    return api.post('/rentals/lender/update-status', { rentalId, status });
};