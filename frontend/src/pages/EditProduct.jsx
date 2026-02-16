import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/products';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
        location: '',
        productImage: null
    });
    const [currentImage, setCurrentImage] = useState("");

    // Fetch existing data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const data = response.data.data;
                setFormData({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    pricePerDay: data.pricePerDay,
                    location: data.location,
                    productImage: null // Don't set file object yet
                });
                setCurrentImage(data.productImage); // Keep old image URL
                setLoading(false);
            } catch (error) {
                alert("Failed to fetch product details");
                navigate('/');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, productImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("pricePerDay", formData.pricePerDay);
        data.append("location", formData.location);
        
        // Only append image if a new one was selected
        if (formData.productImage) {
            data.append("productImage", formData.productImage);
        }

        try {
            await updateProduct(id, data);
            alert("Product updated successfully!");
            navigate(`/product/${id}`);
        } catch (error) {
            alert("Failed to update product");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Name" />
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Description" />
                
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded">
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Fitness">Fitness</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Price" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Location" />
                </div>

                <div>
                    <label className="block text-sm mb-1">Update Image (Optional)</label>
                    <input type="file" onChange={handleFileChange} className="w-full text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Current Image:</p>
                    <img src={currentImage} alt="Current" className="w-20 h-20 object-cover rounded mt-1" />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;