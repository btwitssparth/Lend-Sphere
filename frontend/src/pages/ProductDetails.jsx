import { useEffect, useState, forwardRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import { rentProduct, getUnavailableDates } from '../api/rentals';
import { getProductReviews } from '../api/reviews';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../components/Ui/Button';
import { MapPin, User, ShieldCheck, Tag, ArrowLeft, Edit, Trash2, Calendar, AlertCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// 🔥 1. Import DatePicker and its CSS
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

    // Booking State
    const [startDate, setStartDate] = useState(null); // 🔥 Changed to null for DatePicker
    const [endDate, setEndDate] = useState(null);     // 🔥 Changed to null for DatePicker
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
                
                setProduct(productRes.data.data);
                
                // 🔥 2. Format backend dates so the Calendar understands them
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
    }, [id, navigate]);

    // Real-time Total Price Calculation
    useEffect(() => {
        setBookingError('');
        
        if (startDate && endDate && product) {
            if (endDate <= startDate) {
                setBookingError("End date must be after start date.");
                setTotalPrice(0);
                return;
            }

            // The calendar disables clicked dates, but we still double check if they span ACROSS a disabled date
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

        if (bookingError || !startDate || !endDate || !renterAddress) {
            alert("Please fill in all fields including your usage address.");
            return;
        }

        setBookingLoading(true);
        try {
            await rentProduct({ 
                productId: product._id, 
                startDate: startDate.toISOString(), // Convert Date object back to string for backend
                endDate: endDate.toISOString(), 
                renterAddress 
            });
            alert("✅ Request sent! The lender will review your request.");
            navigate('/my-rentals');
        } catch (error) {
            setBookingError(error.response?.data?.message || "Failed to request rental");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );
    
    if (!product) return null;

    const isOwner = user && product.owner?._id === user._id;
    const displayImages = product.productImages?.length > 0 
        ? product.productImages 
        : [product.productImage || '/default-placeholder.png'];

    // 🔥 Custom Input Field to keep our beautiful UI styling with the DatePicker
    const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
        <div className="relative cursor-pointer" onClick={onClick}>
            <input 
                value={value} 
                ref={ref}
                readOnly
                placeholder={placeholder}
                className="w-full h-12 pl-10 pr-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all cursor-pointer" 
            />
            <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    ));

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-28 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 mb-8 font-semibold text-sm transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-10">
                        
                        {/* Flat Image Gallery */}
                        <div className="space-y-4">
                            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                                <img src={displayImages[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
                            </div>
                            
                            {displayImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {displayImages.map((imgUrl, index) => (
                                        <button 
                                            key={index} onClick={() => setActiveImageIndex(index)}
                                            className={`h-24 w-32 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                activeImageIndex === index ? 'border-zinc-900 dark:border-zinc-100 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Info Section */}
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{product.name}</h1>
                                        {reviewStats.totalReviews > 0 && (
                                            <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-2.5 py-1 rounded-md text-sm font-bold border border-amber-200 dark:border-amber-900/50">
                                                <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
                                                {reviewStats.averageRating} <span className="text-amber-600/70 dark:text-amber-500/70 ml-1 text-xs font-semibold">({reviewStats.totalReviews})</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center text-zinc-500 dark:text-zinc-400 font-medium">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {product.location}
                                    </div>
                                </div>
                                
                                {isOwner && (
                                    <div className="flex gap-3 shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/edit-product/${product._id}`)}>
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={handleDelete}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Flat Tags/Meta */}
                            <div className="flex flex-wrap gap-4 py-6 border-t border-b border-zinc-100 dark:border-zinc-800 mb-8 transition-colors">
                                <Link to={`/profile/${product.owner?._id}`} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex-1 min-w-[200px] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-sm group-hover:scale-105 transition-transform">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-0.5 group-hover:text-blue-500 transition-colors">Lender Profile</p>
                                        <p className="font-bold text-zinc-900 dark:text-zinc-50">{product.owner?.name || "LendSphere User"}</p>
                                    </div>
                                </Link>       
                                
                                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex-1 min-w-[200px]">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-sm">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-0.5">Category</p>
                                        <p className="font-bold text-zinc-900 dark:text-zinc-50">{product.category}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">About this item</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line text-lg">
                                    {product.description}
                                </p>
                            </div>

                            {/* Reviews Section */}
                            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight flex items-center gap-2">
                                    Reviews
                                    <span className="text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full font-bold">
                                        {reviewStats.totalReviews}
                                    </span>
                                </h3>

                                {reviews.length === 0 ? (
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-8 text-center border border-dashed border-zinc-300 dark:border-zinc-800">
                                        <Star className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1">No reviews yet</h4>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Be the first to rent this gear and share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="p-5 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase">
                                                            {review.reviewer?.name?.charAt(0) || "U"}
                                                        </div>
                                                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{review.reviewer?.name || "Anonymous User"}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                                                        {[...Array(5 - review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />)}
                                                    </div>
                                                </div>
                                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">"{review.comment}"</p>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 font-medium">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Sticky Booking Card */}
                    <div className="relative z-10">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6 lg:p-8 transition-colors">
                            
                            <div className="flex items-end gap-2 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">₹{product.pricePerDay}</span>
                                <span className="text-zinc-500 dark:text-zinc-400 font-semibold mb-1">/ day</span>
                            </div>

                            {!isOwner ? (
                                <form onSubmit={handleRent} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        
                                        {/* 🔥 Interactive Start Date Calendar */}
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Start Date</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={new Date()}
                                                excludeDateIntervals={unavailableDates}
                                                customInput={<CustomDateInput placeholder="Check-in" />}
                                                calendarClassName="font-sans border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl"
                                                dayClassName={(date) => "hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"}
                                            />
                                        </div>

                                        {/* 🔥 Interactive End Date Calendar */}
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">End Date</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate || new Date()}
                                                excludeDateIntervals={unavailableDates}
                                                customInput={<CustomDateInput placeholder="Check-out" />}
                                                calendarClassName="font-sans border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl"
                                                dayClassName={(date) => "hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"}
                                            />
                                        </div>
                                    </div>

                                    {/* ADDRESS INPUT */}
                                    <div className="space-y-1.5 mt-2">
                                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Usage Address / Your Location</label>
                                        <div className="relative">
                                            <input 
                                                type="text" required placeholder="e.g. 101 Link Road, Bandra West"
                                                className="w-full h-12 pl-10 pr-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
                                                value={renterAddress} onChange={e => setRenterAddress(e.target.value)} 
                                            />
                                            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Error or Price Display */}
                                    {bookingError ? (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2 text-sm text-red-600 dark:text-red-400 font-medium">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            {bookingError}
                                        </motion.div>
                                    ) : (
                                        totalPrice > 0 && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 overflow-hidden">
                                                <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                                                    <span>₹{product.pricePerDay} x {totalPrice / product.pricePerDay} days</span>
                                                    <span>₹{totalPrice}</span>
                                                </div>
                                                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-zinc-900 dark:text-zinc-50 font-black text-lg">
                                                    <span>Total</span>
                                                    <span>₹{totalPrice}</span>
                                                </div>
                                            </motion.div>
                                        )
                                    )}

                                    <Button 
                                        className="w-full h-14 text-base font-bold rounded-xl" 
                                        type="submit"
                                        disabled={!!bookingError || !startDate || !endDate || !renterAddress || bookingLoading}
                                    >
                                        {bookingLoading ? "Processing..." : "Request to Rent"}
                                    </Button>
                                    <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 font-medium">You won't be charged until the lender approves.</p>
                                </form>
                            ) : (
                                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl text-center transition-colors">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">This is your listing</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Check your dashboard for incoming requests.</p>
                                    <Button variant="outline" className="w-full" onClick={() => navigate('/lender-dashboard')}>Go to Dashboard</Button>
                                </div>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3 transition-colors">
                                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                    <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                                    <span className="font-semibold">Identity Verified Lenders</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                    <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                                    <span className="font-semibold">Secure P2P Payments</span>
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