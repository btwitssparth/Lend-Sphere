import { useEffect, useState, forwardRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import { rentProduct, getUnavailableDates } from '../api/rentals';
import { getProductReviews } from '../api/reviews';
import { toggleWishlist, getWishlist } from '../api/users';
import { useAuth } from '../Context/AuthContext';
import { 
    MapPin, User, ShieldCheck, Tag, ArrowLeft, Edit, Trash2, 
    Calendar, AlertCircle, Star, Heart, CheckCircle2, Clock, 
    Info, MessageCircle, Share2, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });

    const [isWishlisted, setIsWishlisted] = useState(false);

    // Booking State
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [renterAddress, setRenterAddress] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [productRes, datesRes, reviewsRes] = await Promise.all([
                    getProductById(id),
                    getUnavailableDates(id),
                    getProductReviews(id).catch(() => ({ data: { data: { reviews: [], averageRating: 0, totalReviews: 0 } } }))
                ]);
                
                const productData = productRes.data.data;
                setProduct(productData);

                if (user) {
                    try {
                        const wishlistRes = await getWishlist();
                        const myWishlist = wishlistRes.data.data; 
                        const exists = myWishlist.some(item => item._id === productData._id);
                        setIsWishlisted(exists);
                    } catch (error) {
                        console.error("Could not sync wishlist", error);
                    }
                }

                const formattedDates = datesRes.data.data.map(booking => ({
                    start: new Date(booking.startDate),
                    end: new Date(booking.endDate)
                }));
                setUnavailableDates(formattedDates);
                
                if (reviewsRes?.data?.data) {
                    setReviews(reviewsRes.data.data.reviews);
                    setReviewStats({
                        averageRating: reviewsRes.data.data.averageRating,
                        totalReviews: reviewsRes.data.data.totalReviews
                    });
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                navigate('/'); 
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate, user]); 

    useEffect(() => {
        setBookingError('');
        if (startDate && endDate && product) {
            if (endDate <= startDate) {
                setBookingError("End date must be after start date.");
                setTotalPrice(0);
                return;
            }

            const hasOverlap = unavailableDates.some(booking => {
                return (
                    (startDate <= booking.start && endDate >= booking.start) || 
                    (startDate >= booking.start && startDate <= booking.end)    
                );
            });

            if (hasOverlap) {
                setBookingError("These dates overlap with an existing booking.");
                setTotalPrice(0);
                return;
            }

            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const totalDays = diffDays === 0 ? 1 : diffDays;
            
            setTotalPrice(totalDays * product.pricePerDay);
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, product, unavailableDates]);

    const handleWishlist = async () => {
        if (!user) {
            toast.error("Please login to save items.");
            return navigate('/login');
        }
        try {
            setIsWishlisted(!isWishlisted);
            await toggleWishlist(product._id);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        } catch (error) {
            console.error("Wishlist action failed", error);
            setIsWishlisted(!isWishlisted);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            try {
                await deleteProduct(id);
                toast.success("Listing deleted successfully");
                navigate('/');
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const handleRent = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to rent items.");
            return navigate('/login');
        }
        
        if (!user.identityProof) {
            toast.error("Identity verification required to rent.");
            navigate('/upload-id');
            return;
        }

        if (bookingError || !startDate || !endDate || !renterAddress) {
            toast.error("Please complete all booking details.");
            return;
        }

        setBookingLoading(true);
        try {
            await rentProduct({ 
                productId: product._id, 
                startDate: startDate.toISOString(), 
                endDate: endDate.toISOString(), 
                renterAddress 
            });
            toast.success("Request sent! The lender will review it.");
            navigate('/my-rentals');
        } catch (error) {
            setBookingError(error.response?.data?.message || "Failed to request rental");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );
    
    if (!product) return null;

    const isOwner = user && product.owner?._id === user._id;
    const displayImages = product.productImages?.length > 0 
        ? product.productImages 
        : [product.productImage || '/default-placeholder.png'];

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20 transition-colors">
            <div className="container-custom">
                {/* Back Button & Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn-ghost pl-2 pr-4 flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleWishlist}
                            className={`btn-ghost w-10 h-10 p-0 rounded-full flex items-center justify-center ${isWishlisted ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30' : ''}`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        {isOwner && (
                            <>
                                <Link to={`/edit-product/${product._id}`} className="btn-secondary px-4 py-2 text-sm">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Link>
                                <button onClick={handleDelete} className="btn-secondary px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Images & Info */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <motion.div 
                                layoutId="main-image"
                                className="aspect-[16/10] rounded-[32px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                            >
                                <img 
                                    src={displayImages[activeImageIndex]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            {displayImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {displayImages.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-zinc-900 dark:border-zinc-50 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
                                        {product.category}
                                    </span>
                                    {product.quantity > 1 && (
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Layers className="w-3 h-3" />
                                            {product.quantity} Units Available
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-black">{reviewStats.averageRating || 'New'}</span>
                                        <span className="text-zinc-400 font-medium">({reviewStats.totalReviews} reviews)</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-4 text-zinc-500 dark:text-zinc-400 font-medium">
                                    <MapPin className="w-5 h-5 text-zinc-400" />
                                    {product.location}
                                </div>
                            </div>

                            <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Description</h3>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            {/* Lender Profile */}
                            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        {product.owner?.avatar ? (
                                            <img src={product.owner.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-zinc-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Listed By</p>
                                        <p className="text-lg font-black text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {product.owner?.name || 'Lender'}
                                        </p>
                                    </div>
                                </div>
                                <Link to={`/profile/${product.owner?._id}`} className="btn-secondary px-4 py-2 text-sm">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Booking Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <div className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                    <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">₹{product.pricePerDay}</span>
                                    <span className="text-lg text-zinc-400 font-bold uppercase tracking-widest">/ Day</span>
                                </div>

                                <form onSubmit={handleRent} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Start Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none" />
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={date => setStartDate(date)}
                                                        selectsStart
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        minDate={new Date()}
                                                        excludeDateIntervals={unavailableDates}
                                                        placeholderText="Pick date"
                                                        className="input-modern pl-11 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">End Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none" />
                                                    <DatePicker
                                                        selected={endDate}
                                                        onChange={date => setEndDate(date)}
                                                        selectsEnd
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        minDate={startDate || new Date()}
                                                        excludeDateIntervals={unavailableDates}
                                                        placeholderText="Pick date"
                                                        className="input-modern pl-11 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Delivery Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Where will you use this?"
                                                    className="input-modern pl-11 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800"
                                                    value={renterAddress}
                                                    onChange={(e) => setRenterAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {bookingError && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900/50"
                                            >
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                {bookingError}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {totalPrice > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800"
                                        >
                                            <div className="flex justify-between items-center mb-2 text-sm font-medium text-zinc-500">
                                                <span>Rental Duration</span>
                                                <span className="text-zinc-900 dark:text-zinc-50 font-black">{Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) || 1} Days</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                                <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">Total Price</span>
                                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{totalPrice}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={bookingLoading || isOwner}
                                        className="btn-primary w-full py-4 text-lg font-black shadow-xl shadow-zinc-200 dark:shadow-none disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400"
                                    >
                                        {bookingLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                        ) : isOwner ? (
                                            "You own this item"
                                        ) : (
                                            "Request Rental"
                                        )}
                                    </button>
                                </form>

                                <p className="text-center mt-6 text-xs text-zinc-400 font-medium">
                                    You won't be charged yet. The lender needs to approve your request first.
                                </p>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex gap-4">
                                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-blue-900 dark:text-blue-200 mb-1">LendSphere Protection</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                                        All rentals are covered by our safety guarantee. We verify all users and hold payments securely.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;