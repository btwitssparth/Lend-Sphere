import api from './axios';

// Add a new Product
export const addProduct = async (productData) => {
    return api.post('/products/add', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// Get All Products (Supports Search & Filter)
export const getAllProducts = async (search = "", category = "", location = "", lat = "", lng = "", radius = 5) => {
    return api.get(`/products?search=${search}&category=${category}&location=${location}&lat=${lat}&lng=${lng}&radius=${radius}`);
};

// Get Single Product
export const getProductById = async (id) => {
    return api.get(`/products/${id}`);
};

// Update Product
export const updateProduct = async (id, formData) => {
    return api.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// Delete Product
export const deleteProduct = async (id) => {
    return api.delete(`/products/${id}`);
};