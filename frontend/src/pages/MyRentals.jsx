import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign, MessageCircle } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import ChatBox from '../components/Chat/Chatbox';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeRentalId, setActiveRentalId] = useState(null);
    const [activeRentalStatus, setActiveRentalStatus] = useState(null);

    useEffect(() => {
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
        fetchRentals();
    }, []);

    const openChat = (rental) => {
        setActiveRentalId(rental._id);
        setActiveRentalStatus(rental.status);
        setIsChatOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
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
                                {/* Flat Product Image */}
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
                                    
                                    {/* Actions & Status */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                                        
                                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${
                                            rental.status === 'Approved' || rental.status === 'Active' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100' : 
                                            rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' :
                                            'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                        }`}>
                                            {rental.status}
                                        </span>

                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => openChat(rental)}
                                            className="w-full sm:w-auto"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Message
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Socket.io Chat Modal */}
            <ChatBox 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                rentalId={activeRentalId}
                rentalStatus={activeRentalStatus}
            />
        </div>
    );
};

export default MyRentals;