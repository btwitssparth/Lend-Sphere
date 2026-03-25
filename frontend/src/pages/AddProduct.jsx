import { useState } from 'react';
import { addProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, IndianRupee, MapPin, Type, AlignLeft, Tag, 
    Loader2, Navigation, Layers, ArrowLeft, X, CheckCircle2,
    Info, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

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
        quantity: '1',
        latitude: '', 
        longitude: '' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); 
        const currentFiles = formData.productImages || [];
        
        if (currentFiles.length + files.length > 5) {
            toast.error("You can only upload up to 5 images in total.");
            return;
        }

        const newFiles = [...currentFiles, ...files];
        setFormData({ ...formData, productImages: newFiles });
        
        const newPreviews = newFiles.map(file => {
            if (typeof file === 'string') return file; // If somehow we have a string URL
            return URL.createObjectURL(file);
        });
        setPreviews(newPreviews);
    };

    const removeImage = (index) => {
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);

        const newFiles = [...formData.productImages];
        newFiles.splice(index, 1);
        setFormData({ ...formData, productImages: newFiles });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        
        const toastId = toast.loading("Getting your location...");
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    location: "Current Location" 
                });
                toast.success("Location updated!", { id: toastId });
            },
            () => {
                toast.error("Unable to retrieve location. Please check permissions.", { id: toastId });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.productImages || formData.productImages.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

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
            toast.success("Item listed successfully!");
            navigate('/');
        } catch (error) {
            console.error("Upload Error: ", error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="container-custom max-w-4xl">
                <button onClick={() => navigate(-1)} className="btn-ghost pl-0 mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Header & Tips */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                                List your <br />
                                <span className="text-zinc-400 dark:text-zinc-600">Product.</span>
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mt-4">
                                Join our community of lenders and start earning from your gear today.
                            </p>
                        </div>

                        <div className="p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" /> Pro Tips
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Use clear, bright photos from multiple angles.",
                                    "Write a detailed description including accessories.",
                                    "Be responsive to rental requests to earn trust.",
                                    "Set a fair price compared to similar items."
                                ].map((tip, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Product Images</label>
                                <div className={`relative border-2 border-dashed rounded-[32px] p-8 transition-all ${
                                    previews.length > 0 
                                        ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20' 
                                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/50'
                                }`}>
                                    <input 
                                        type="file" 
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    
                                    {previews.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {previews.map((src, index) => (
                                                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeImage(index);
                                                        }}
                                                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {previews.length < 5 && (
                                                <div className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                                                    <Plus className="w-6 h-6 text-zinc-300" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Drop your photos here</p>
                                            <p className="text-sm text-zinc-500 font-medium mt-1">Upload up to 5 high-quality images</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Product Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input 
                                            type="text" 
                                            name="name" 
                                            required 
                                            value={formData.name}
                                            placeholder="What are you lending?" 
                                            className="input-modern pl-12"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                                        <textarea 
                                            name="description" 
                                            required 
                                            value={formData.description}
                                            rows="4"
                                            placeholder="Condition, features, and what's included..." 
                                            className="input-modern pl-12 min-h-[120px] py-4 resize-none"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <select 
                                            name="category" 
                                            required 
                                            value={formData.category}
                                            className="input-modern pl-12 appearance-none cursor-pointer"
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

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Price per Day</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input 
                                            type="number" 
                                            name="pricePerDay" 
                                            required 
                                            value={formData.pricePerDay}
                                            placeholder="0" 
                                            className="input-modern pl-12 font-bold"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Quantity Available</label>
                                    <div className="relative">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input 
                                            type="number" 
                                            name="quantity" 
                                            required 
                                            min="1"
                                            value={formData.quantity}
                                            placeholder="1" 
                                            className="input-modern pl-12 font-bold"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Location</label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                            <input 
                                                type="text" 
                                                name="location" 
                                                required 
                                                value={formData.location}
                                                placeholder="e.g. Bandra West, Mumbai" 
                                                className="input-modern pl-12"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleGetLocation}
                                            className="btn-secondary px-4 shrink-0"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg font-black shadow-xl shadow-zinc-200 dark:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                ) : (
                                    "List Product Now"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;