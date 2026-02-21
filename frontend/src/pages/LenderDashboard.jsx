import { useEffect, useState } from 'react';
import { getLenderRequests, updateRentalStatus } from '../api/rentals';
import { motion } from 'framer-motion';
import { Plus, User, Calendar, DollarSign, Check, X, MessageCircle, Package } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import { Link } from 'react-router-dom';
import ChatBox from '../components/Chat/Chatbox';

const LenderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeRentalId, setActiveRentalId] = useState(null);
    const [activeRentalStatus, setActiveRentalStatus] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await getLenderRequests();
            setRequests(res.data.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (rentalId, newStatus) => {
        try {
            await updateRentalStatus(rentalId, newStatus);
            fetchRequests(); 
        } catch (error) {
            alert("Failed to update status");
        }
    };

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
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Lender Dashboard</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Manage incoming requests and your earnings.</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Link to="/add-product">
                            <Button size="lg" className="rounded-xl w-full md:w-auto">
                                <Plus className="w-5 h-5 mr-2" /> List New Item
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {requests.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 transition-colors"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-3">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">All caught up!</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">No pending requests right now. Keep your gear listed to earn more.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-5">
                        {requests.map((rental, index) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row gap-6 items-start lg:items-center group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                            >
                                {/* Flat Product Image */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                        alt={rental.product?.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-center">
                                    
                                    {/* Product & Renter Details */}
                                    <div className="md:col-span-5">
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-1 line-clamp-1">{rental.product?.name}</h3>
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                                <User className="w-4 h-4 mr-2" />
                                                Requested by <span className="text-zinc-900 dark:text-zinc-100 font-bold ml-1">{rental.renter?.name}</span>
                                            </div>
                                            {rental.renter?.identityProof ? (
                                                <a 
                                                    href={rental.renter.identityProof} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline w-fit ml-6"
                                                >
                                                    View Renter's Govt ID
                                                </a>
                                            ) : (
                                                <span className="text-xs text-red-600 dark:text-red-400 font-bold ml-6">No ID uploaded</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dates & Price */}
                                    <div className="md:col-span-3 flex flex-col justify-center">
                                        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                            <DollarSign className="w-4 h-4 mr-1 text-zinc-400" />
                                            Earn ₹{rental.totalPrice}
                                        </div>
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="md:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-3 w-full border-t border-zinc-100 dark:border-zinc-800 pt-4 md:border-0 md:pt-0 mt-2 md:mt-0">
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => openChat(rental)}
                                            className="bg-white dark:bg-zinc-950 shrink-0"
                                        >
                                            <MessageCircle className="w-4 h-4 sm:mr-2" />
                                            <span className="hidden sm:inline">Message</span>
                                        </Button>

                                        {rental.status === 'Pending' ? (
                                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <Button 
                                                    onClick={() => handleStatusUpdate(rental._id, "Approved")}
                                                    className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-none flex-1 sm:flex-none"
                                                    size="sm"
                                                >
                                                    <Check className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                                <Button 
                                                    onClick={() => handleStatusUpdate(rental._id, "Rejected")}
                                                    variant="danger"
                                                    size="sm"
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap border shrink-0 ${
                                                rental.status === 'Approved' || rental.status === 'Active' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100' : 
                                                rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' :
                                                'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                            }`}>
                                                {rental.status}
                                            </span>
                                        )}
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

export default LenderDashboard;