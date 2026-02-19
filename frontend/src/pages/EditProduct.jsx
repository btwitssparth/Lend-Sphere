import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/products';
import { motion } from 'framer-motion';
import { Upload, DollarSign, MapPin, Type, AlignLeft, Tag, ArrowLeft, Loader2 } from 'lucide-react';
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
        productImages: []
    });
    
    const [currentImages, setCurrentImages] = useState([]); 
    const [previews, setPreviews] = useState([]); 

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
                    productImages: []
                });
                
                const loadedImages = data.productImages?.length > 0 ? data.productImages : (data.productImage ? [data.productImage] : []);
                setCurrentImages(loadedImages);
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
        setSaving(true);
        
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
            await updateProduct(id, data);
            navigate(`/product/${id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to update product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-black dark:text-white">Loading editor...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 flex justify-center dark:bg-black transition-colors duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Edit Listing</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Update details for {formData.name}</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-800 overflow-hidden transition-colors">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Item Photos (Up to 5)</label>
                            
                            {/* Warning Note */}
                            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-2 rounded border border-amber-200 dark:border-amber-900/50 transition-colors">
                                Note: Uploading new photos will completely replace the current photos.
                            </p>

                            <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${previews.length > 0 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-zinc-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                                <input 
                                    type="file" 
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                
                                {previews.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-20 pointer-events-none">
                                        {previews.map((src, index) => (
                                            <div key={index} className="relative h-24 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-700">
                                                <img src={src} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">NEW</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative z-0">
                                        {currentImages.length > 0 && (
                                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                                                {currentImages.map((src, index) => (
                                                    <div key={index} className="relative h-16 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 opacity-80 grayscale-[30%]">
                                                        <img src={src} alt="Current" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center py-2">
                                            <Upload className="w-8 h-8 text-blue-500 mb-2" />
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload new photos</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Leave empty to keep current photos</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
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
                                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1 py-4 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:border-zinc-700">Cancel</Button>
                            <Button type="submit" className="flex-1 py-4 shadow-xl shadow-blue-600/20" disabled={saving}>
                                {saving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditProduct;