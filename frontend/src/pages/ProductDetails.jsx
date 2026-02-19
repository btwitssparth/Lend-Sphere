import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import api from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../components/Ui/Button';
import { MapPin, User, ShieldCheck, Tag, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                navigate('/'); 
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            try {
                await deleteProduct(id);
                navigate('/');
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    const handleRent = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to rent items.");
            return navigate('/login');
        }
        if (!user.identityProof) {
            const confirmVerification = window.confirm(
                "⚠️ Identity Verification Required\n\nTo ensure safety, you must upload a Government ID once before renting.\n\nClick OK to verify now."
            );
            if (confirmVerification) navigate('/upload-id');
            return;
        }

        try {
            await api.post('/rentals/request', { productId: product._id, startDate, endDate });
            alert("✅ Request sent! The lender will review your request.");
            navigate('/my-rentals');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to request rental");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20 dark:bg-black dark:text-white transition-colors">Loading details...</div>;
    if (!product) return null;

    const isOwner = user && product.owner?._id === user._id;
    const displayImages = product.productImages?.length > 0 
        ? product.productImages 
        : [product.productImage || '/default-placeholder.png'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pt-28 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-8">
                        
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="rounded-3xl overflow-hidden shadow-sm aspect-video bg-slate-200 dark:bg-zinc-900">
                                <img 
                                    src={displayImages[activeImageIndex]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                            
                            {displayImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {displayImages.map((imgUrl, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImageIndex === index ? 'border-blue-600 dark:border-blue-500 opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h1>
                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                                        {product.location}
                                    </div>
                                </div>
                                
                                {isOwner && (
                                    <div className="flex gap-3">
                                        <Button variant="secondary" size="sm" onClick={() => navigate(`/edit-product/${product._id}`)} className="dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:border-zinc-700">
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={handleDelete}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-6 py-6 border-t border-b border-slate-100 dark:border-zinc-800 mb-6 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Lender</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{product.owner?.name || "LendSphere User"}</p>
                                    </div>
                                </div>
                                <div className="w-px bg-slate-100 dark:bg-zinc-800 hidden sm:block transition-colors"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Category</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{product.category}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">About this item</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Sticky Booking Card */}
                    <div className="relative">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-28 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-none p-6 lg:p-8 transition-colors">
                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{product.pricePerDay}</span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">/ day</span>
                            </div>

                            {!isOwner ? (
                                <form onSubmit={handleRent} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Date</label>
                                            <input type="date" required className="w-full p-3 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark] focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                                            <input type="date" required className="w-full p-3 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark] focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <Button className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40" type="submit">
                                        Request to Rent
                                    </Button>
                                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-2">You won't be charged until the lender approves.</p>
                                </form>
                            ) : (
                                <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl text-center border border-slate-100 dark:border-zinc-800 transition-colors">
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">This is your listing</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Check your dashboard for incoming requests.</p>
                                    <Button variant="outline" className="w-full dark:border-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-800" onClick={() => navigate('/lender-dashboard')}>Go to Dashboard</Button>
                                </div>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 transition-colors">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    <ShieldCheck className="w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span className="font-medium">Identity Verified Lenders</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                    <span className="font-medium">Secure Payments</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;