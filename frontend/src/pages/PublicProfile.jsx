import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { motion } from 'framer-motion';
import { Star, Package, Calendar, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfile(id);
                setData(res.data.data);
            } catch (error) {
                console.error("Failed to load profile:", error);
                alert("User not found");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    if (!data) return null;

    const { profile, products, reviews, stats } = data;

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 mb-8 font-semibold text-sm transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                {/* Profile Header Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    
                    <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-5xl font-black shrink-0 border-4 border-white dark:border-zinc-950 shadow-xl z-10">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{profile.name}</h1>
                            <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md">
                                <ShieldCheck className="w-3 h-3" /> Identity Verified
                            </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 flex items-center justify-center md:justify-start gap-2 mb-6 font-medium">
                            <Calendar className="w-4 h-4" /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rating</p>
                                    <p className="font-black text-zinc-900 dark:text-zinc-50">{stats.averageRating} <span className="text-sm font-medium text-zinc-500">({stats.totalReviews})</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-500">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Listed Gear</p>
                                    <p className="font-black text-zinc-900 dark:text-zinc-50">{products.length} Items</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Listed Gear Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight flex items-center gap-2">
                        Gear by {profile.name.split(' ')[0]}
                    </h2>
                    
                    {products.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">This user currently has no active listings.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link to={`/product/${product._id}`} key={product._id} className="group block">
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                                        <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                                            <img 
                                                src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 truncate mb-1">{product.name}</h3>
                                            <div className="flex justify-between items-end mt-3">
                                                <p className="text-zinc-500 dark:text-zinc-400 text-xs flex items-center"><MapPin className="w-3 h-3 mr-1" />{product.location}</p>
                                                <p className="font-black text-zinc-900 dark:text-zinc-50">₹{product.pricePerDay}<span className="text-xs font-medium text-zinc-500">/day</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight flex items-center gap-2">
                        Reviews as Lender <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm px-2.5 py-0.5 rounded-full">{stats.totalReviews}</span>
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center">
                            <Star className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No reviews received yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map(review => (
                                <div key={review._id} className="p-5 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{review.reviewer?.name || "Anonymous"}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Rented: {review.product?.name}</p>
                                        </div>
                                        <div className="flex items-center">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                                            {[...Array(5 - review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />)}
                                        </div>
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">"{review.comment}"</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-4 font-medium">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;