import api from './axios';

// Get all products
export const getAllProducts = (queryString = '') => {
    return api.get(`/products?${queryString}`);
};

// Get a single product by its ID
export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};

// 🔥 FIXED: Renamed from createProduct to addProduct to match your UI
export const addProduct = (productData) => {
    return api.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Update an existing product
export const updateProduct = (id, productData) => {
    return api.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Delete a product
export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};

// Get all products listed by the currently logged-in user
export const getMyListings = () => {
    return api.get('/products/my-listings');
};