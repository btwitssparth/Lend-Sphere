import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/products';
import { motion } from 'framer-motion';
import { Upload, DollarSign, MapPin, Type, AlignLeft, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
        location: '',
        productImage: null
    });
    const [currentImage, setCurrentImage] = useState("");
    const [preview, setPreview] = useState(null);

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
                    productImage: null
                });
                setCurrentImage(data.productImage);
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
        const file = e.target.files[0];
        setFormData({ ...formData, productImage: file });
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'productImage' && !formData[key]) return; // Skip if no new image
            data.append(key, formData[key]);
        });

        try {
            await updateProduct(id, data);
            navigate(`/product/${id}`);
        } catch (error) {
            alert("Failed to update product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Edit Listing</h1>
                    <p className="text-slate-500 mt-2">Update details for {formData.name}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* Image Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700">Item Photo</label>
                            
                            {/* Current Image Preview */}
                            {!preview && currentImage && (
                                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 border border-slate-200">
                                    <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Current Image</div>
                                </div>
                            )}

                            <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${preview ? 'border-blue-500' : 'border-slate-300 hover:border-blue-400'}`}>
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {preview ? (
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm">
                                        <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-medium">Click to change</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <Upload className="w-8 h-8 text-blue-500 mb-2" />
                                        <p className="font-medium text-slate-700">Upload new photo</p>
                                        <p className="text-xs text-slate-400">Leave empty to keep current photo</p>
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
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
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
                                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1 py-4">Cancel</Button>
                            <Button type="submit" className="flex-1 py-4 shadow-xl shadow-blue-600/20" isLoading={saving}>Save Changes</Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditProduct;