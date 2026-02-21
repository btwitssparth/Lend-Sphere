import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';
import { addReview } from '../api/reviews';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, DollarSign, MessageCircle, Star, X } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import ChatBox from '../components/Chat/Chatbox';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

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
            alert("✅ Review submitted successfully!");
            setIsReviewOpen(false);
            fetchRentals(); // Refresh the list to hide the button
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                
                <div className="mb-10">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">My Rentals</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Track the status of items you've requested to rent.</p>
                    </motion.div>
                </div>

                {rentals.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 transition-colors"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">No rentals yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Start exploring products to borrow gear.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {rentals.map((rental, index) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 items-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200"
                            >
                                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                        alt={rental.product?.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-3 line-clamp-1">{rental.product?.name}</h3>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(rental.startDate).toLocaleDateString()} to {new Date(rental.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                <DollarSign className="w-4 h-4 mr-2 text-zinc-400" />
                                                Total: ₹{rental.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                                        
                                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${
                                            rental.status === 'Approved' || rental.status === 'Active' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100' : 
                                            rental.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                            rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' :
                                            'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                        }`}>
                                            {rental.status}
                                        </span>

                                        <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-end">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => openChat(rental)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <MessageCircle className="w-4 h-4 sm:mr-2" />
                                                <span className="hidden sm:inline">Message</span>
                                            </Button>

                                            {/* Show Review Button ONLY if Completed and NOT Reviewed */}
                                            {rental.status === 'Completed' && !rental.isReviewed && (
                                                <Button 
                                                    onClick={() => openReviewModal(rental._id)}
                                                    size="sm" 
                                                    className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md shadow-amber-500/20"
                                                >
                                                    <Star className="w-4 h-4 sm:mr-1 fill-white" />
                                                    <span className="hidden sm:inline">Review</span>
                                                </Button>
                                            )}

                                            {/* Show Static Rating if ALREADY Reviewed */}
                                            {rental.isReviewed && rental.review && (
                                                <div className="flex items-center px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-md text-xs font-bold border border-amber-200 dark:border-amber-900/50 shrink-0">
                                                    <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                                    Rated {rental.review.rating} Stars
                                                </div>
                                            )}
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

            {/* The Review Modal */}
            <AnimatePresence>
                {isReviewOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Rate your experience</h3>
                                <button onClick={() => setIsReviewOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={submitReview} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 text-center">How was the gear?</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none hover:scale-110 transition-transform"
                                            >
                                                <Star 
                                                    className={`w-10 h-10 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Leave a comment</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell others about your experience..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={reviewLoading} 
                                    className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white border-none"
                                >
                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyRentals;