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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                navigate('/'); // Redirect if not found
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    // Handle Delete (Owner Only)
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

    // Handle Rent Request with Security Check
    const handleRent = async (e) => {
        e.preventDefault();

        // 1. Check Login
        if (!user) {
            alert("Please login to rent items.");
            return navigate('/login');
        }

        // 2. Check Identity Proof (The "One-Time" Verification)
        if (!user.identityProof) {
            const confirmVerification = window.confirm(
                "⚠️ Identity Verification Required\n\nTo ensure safety, you must upload a Government ID once before renting.\n\nClick OK to verify now."
            );
            
            if (confirmVerification) {
                navigate('/upload-id');
            }
            return;
        }

        // 3. Send Request
        try {
            await api.post('/rentals/request', { productId: product._id, startDate, endDate });
            alert("✅ Request sent! The lender will review your request.");
            navigate('/my-rentals');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to request rental");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading details...</div>;
    if (!product) return null;

    // Check ownership
    const isOwner = user && product.owner?._id === user._id;

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN: Images & Description */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Image */}
                        <div className="rounded-3xl overflow-hidden shadow-sm aspect-video bg-slate-200">
                            <img 
                                src={product.productImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                            />
                        </div>

                        {/* Title & Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center text-slate-500">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                        {product.location}
                                    </div>
                                </div>
                                
                                {/* Edit/Delete for Owner */}
                                {isOwner && (
                                    <div className="flex gap-3">
                                        <Button variant="secondary" size="sm" onClick={() => navigate(`/edit-product/${product._id}`)}>
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={handleDelete}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 py-6 border-t border-b border-slate-100 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lender</p>
                                        <p className="font-semibold text-slate-900">{product.owner?.name || "LendSphere User"}</p>
                                    </div>
                                </div>
                                <div className="w-px bg-slate-100 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Category</p>
                                        <p className="font-semibold text-slate-900">{product.category}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 mb-3">About this item</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Sticky Booking Card */}
                    <div className="relative">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 lg:p-8"
                        >
                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-4xl font-bold text-slate-900">₹{product.pricePerDay}</span>
                                <span className="text-slate-500 font-medium mb-1">/ day</span>
                            </div>

                            {!isOwner ? (
                                <form onSubmit={handleRent} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                                            <input 
                                                type="date" 
                                                required 
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                                value={startDate} 
                                                onChange={e => setStartDate(e.target.value)} 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                                            <input 
                                                type="date" 
                                                required 
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                                value={endDate} 
                                                onChange={e => setEndDate(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40" 
                                        type="submit"
                                    >
                                        Request to Rent
                                    </Button>
                                    
                                    <p className="text-xs text-center text-slate-400 mt-2">
                                        You won't be charged until the lender approves.
                                    </p>
                                </form>
                            ) : (
                                <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                    <p className="font-bold text-slate-900 mb-1">This is your listing</p>
                                    <p className="text-sm text-slate-500 mb-4">Check your dashboard for incoming requests.</p>
                                    <Button variant="outline" className="w-full" onClick={() => navigate('/lender-dashboard')}>
                                        Go to Dashboard
                                    </Button>
                                </div>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <span className="font-medium">Identity Verified Lenders</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
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