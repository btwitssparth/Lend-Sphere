import { useState } from 'react';
import { addProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, DollarSign, MapPin, Type, AlignLeft, Tag, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, productImage: file });
        
        // Create preview URL
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            await addProduct(data);
            navigate('/');
        } catch (error) {
            alert("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">List an Item</h1>
                    <p className="text-slate-500 mt-2">Share your gear with the world and earn.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700">Item Photo</label>
                            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${preview ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required 
                                />
                                {preview ? (
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium">
                                            Click to change
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 py-8">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-700">Click or drag photo here</p>
                                        <p className="text-sm text-slate-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        placeholder="e.g. Sony A7III Camera" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <textarea 
                                        name="description" 
                                        required 
                                        rows="4"
                                        placeholder="Describe the condition, features, and what's included..." 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <select 
                                        name="category" 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Vehicles">Vehicles</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Tools">Tools</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Price per Day</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="number" 
                                        name="pricePerDay" 
                                        required 
                                        placeholder="0.00" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        required 
                                        placeholder="e.g. Mumbai, Bandra West" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full py-4 text-lg shadow-xl shadow-blue-600/20"
                                isLoading={loading}
                            >
                                Publish Listing
                            </Button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddProduct;