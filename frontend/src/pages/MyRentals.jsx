import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';
import { addReview } from '../api/reviews';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, IndianRupee, MessageCircle, Star, X, ArrowLeft, ChevronRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ChatBox from '../components/Chat/Chatbox';
import toast from 'react-hot-toast';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeRentalId, setActiveRentalId] = useState(null);
    const [activeRentalStatus, setActiveRentalStatus] = useState(null);

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewRentalId, setReviewRentalId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);

    const fetchRentals = async () => {
        try {
            const response = await getMyRentals();
            setRentals(response.data.data);
        } catch (error) {
            console.error("Error fetching my rentals:", error);
            toast.error("Failed to load rentals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const openChat = (rental) => {
        setActiveRentalId(rental._id);
        setActiveRentalStatus(rental.status);
        setIsChatOpen(true);
    };

    const openReviewModal = (rentalId) => {
        setReviewRentalId(rentalId);
        setRating(5);
        setComment("");
        setIsReviewOpen(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await addReview({ rentalId: reviewRentalId, rating, comment });
            toast.success("Review submitted successfully!");
            setIsReviewOpen(false);
            fetchRentals(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="container-custom max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <button onClick={() => navigate('/')} className="btn-ghost pl-0 mb-4 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Explore
                        </button>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                            My Rentals
                        </h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                            Manage your rental requests and active bookings.
                        </p>
                    </div>
                </div>

                {rentals.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors"
                    >
                        <div className="w-20 h-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-6">
                            <Package className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2">No rentals yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">Start exploring products to borrow gear from your community.</p>
                        <Link to="/" className="btn-primary">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6">
                        {rentals.map((rental, idx) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-6 md:p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 shrink-0">
                                        <img 
                                            src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                            alt="" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight truncate">{rental.product?.name}</h3>
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                        rental.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                        rental.status === 'Approved' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        rental.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                                                        rental.status === 'Completed' ? 'bg-zinc-50 text-zinc-600 border-zinc-200' :
                                                        'bg-red-50 text-red-600 border-red-200'
                                                    }`}>
                                                        {rental.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    <div className="flex items-center text-sm font-medium text-zinc-500">
                                                        <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                                                        {new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center text-sm font-medium text-zinc-500">
                                                        <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                                                        {Math.ceil(Math.abs(new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24)) || 1} Days
                                                    </div>
                                                    <div className="flex items-center text-sm font-medium text-zinc-500">
                                                        <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                                                        {rental.renterAddress}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Cost</p>
                                                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">₹{rental.totalPrice}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                            <button onClick={() => openChat(rental)} className="btn-secondary py-2 text-sm">
                                                <MessageCircle className="w-4 h-4 mr-2" /> Message Lender
                                            </button>
                                            
                                            {rental.status === 'Completed' && !rental.isReviewed && (
                                                <button 
                                                    onClick={() => openReviewModal(rental._id)}
                                                    className="btn-primary py-2 text-sm bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600"
                                                >
                                                    <Star className="w-4 h-4 mr-2 fill-white" /> Rate Experience
                                                </button>
                                            )}

                                            {rental.isReviewed && rental.review && (
                                                <div className="flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black border border-amber-100 dark:border-amber-800/50">
                                                    <Star className="w-4 h-4 mr-2 fill-current" />
                                                    You rated {rental.review.rating}/5
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 ml-auto">
                                                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                                                Protected by LendSphere
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <ChatBox 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                rentalId={activeRentalId}
                rentalStatus={activeRentalStatus}
            />

            {/* Review Modal */}
            <AnimatePresence>
                {isReviewOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8 pb-0 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">How was it?</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Your feedback helps the community.</p>
                                </div>
                                <button onClick={() => setIsReviewOpen(false)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                    <X className="w-6 h-6 text-zinc-400" />
                                </button>
                            </div>
                            
                            <form onSubmit={submitReview} className="p-8 space-y-8">
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform active:scale-90"
                                        >
                                            <Star 
                                                className={`w-10 h-10 transition-colors ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Your Comment</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Describe your experience with the item and the lender..."
                                        className="input-modern min-h-[120px] py-4 resize-none"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={reviewLoading} 
                                    className="btn-primary w-full py-4 text-lg font-black"
                                >
                                    {reviewLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                    ) : "Submit Review"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyRentals;