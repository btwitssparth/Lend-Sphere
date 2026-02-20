import api from './axios';

// --- NEW BOOKING ENDPOINTS ---

// Send a rental request for a product
export const rentProduct = async (rentalData) => {
    return api.post('/rentals/request', rentalData);
};

// Fetch the dates that are already booked for a specific product
export const getUnavailableDates = async (productId) => {
    return api.get(`/rentals/unavailable-dates/${productId}`);
};


// --- EXISTING ENDPOINTS ---

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