import { useState } from 'react';
import { addProduct } from '../api/products'; // We will create this API file next
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
        location: '',
        productImage: null 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, productImage: file });
        
        // Show image preview
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create FormData (Required for file uploads)
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("pricePerDay", formData.pricePerDay);
        data.append("location", formData.location);
        data.append("productImage", formData.productImage); 

        try {
            await addProduct(data);
            alert("Product listed successfully!");
            navigate('/'); 
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to add product";
            alert(msg);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">List an Item for Rent</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Item Name</label>
                    <input type="text" name="name" onChange={handleChange} required 
                        className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea name="description" rows="3" onChange={handleChange} required 
                        className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                
                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" onChange={handleChange} required 
                            className="mt-1 w-full p-2 border rounded-md"
                        >
                            <option value="">Select...</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Tools">Tools</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Price / Day (₹)</label>
                        <input type="number" name="pricePerDay" onChange={handleChange} required 
                            className="mt-1 w-full p-2 border rounded-md" 
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Location</label>
                    <input type="text" name="location" onChange={handleChange} required placeholder="e.g. Mumbai, Andheri"
                        className="mt-1 w-full p-2 border rounded-md" 
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Product Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} required 
                        className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                    {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover mt-4 rounded-md border" />}
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    List Item
                </button>
            </form>
        </div>
    );
};

export default AddProduct;