import { useState } from 'react';
import { addProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, DollarSign, MapPin, Type, AlignLeft, Tag, Loader2 } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]); 
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
        location: '',
        productImages: [] 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); 
        
        if (files.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        setFormData({ ...formData, productImages: files });
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (key !== 'productImages') {
                data.append(key, formData[key]);
            }
        });

        formData.productImages.forEach(file => {
            data.append('productImages', file);
        });

        try {
            await addProduct(data);
            navigate('/');
        } catch (error) {
            console.error("Upload Error: ", error);
            alert("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 flex justify-center dark:bg-black transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">List an Item</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Share your gear with the world and earn.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-800 overflow-hidden transition-colors">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Item Photos (Up to 5)</label>
                            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${previews.length > 0 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-zinc-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                                <input 
                                    type="file" 
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    required={previews.length === 0} 
                                />
                                
                                {previews.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-20 pointer-events-none">
                                        {previews.map((src, index) => (
                                            <div key={index} className="relative h-32 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors">
                                                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 py-8 relative z-0">
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 transition-colors">Click or drag photos here</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors">SVG, PNG, JPG or GIF (max 5 files)</p>
                                    </div>
                                )}
                            </div>
                            {previews.length > 0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 transition-colors">
                                    Click the area above to change your selected photos.
                                </p>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        value={formData.name}
                                        placeholder="e.g. Sony A7III Camera" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <textarea 
                                        name="description" 
                                        required 
                                        value={formData.description}
                                        rows="4"
                                        placeholder="Describe the condition, features, and what's included..." 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <select 
                                        name="category" 
                                        required 
                                        value={formData.category}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                        onChange={handleChange}
                                    >
                                        <option value="" className="dark:bg-zinc-800">Select Category</option>
                                        <option value="Electronics" className="dark:bg-zinc-800">Electronics</option>
                                        <option value="Furniture" className="dark:bg-zinc-800">Furniture</option>
                                        <option value="Vehicles" className="dark:bg-zinc-800">Vehicles</option>
                                        <option value="Fitness" className="dark:bg-zinc-800">Fitness</option>
                                        <option value="Tools" className="dark:bg-zinc-800">Tools</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Price per Day</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <input 
                                        type="number" 
                                        name="pricePerDay" 
                                        required 
                                        value={formData.pricePerDay}
                                        placeholder="0.00" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        required 
                                        value={formData.location}
                                        placeholder="e.g. Mumbai, Bandra West" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full py-4 text-lg shadow-xl shadow-blue-600/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Publishing...
                                    </span>
                                ) : (
                                    "Publish Listing"
                                )}
                            </Button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddProduct;