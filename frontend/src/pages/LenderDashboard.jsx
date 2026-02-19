import { useEffect, useState } from 'react';
import { getLenderRequests, updateRentalStatus } from '../api/rentals';
import { motion } from 'framer-motion';
import { Plus, User, Calendar, DollarSign, Check, X } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import { Link } from 'react-router-dom';

const LenderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20 dark:bg-black dark:text-white">Loading dashboard...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Lender Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage incoming requests and your earnings.</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/add-product">
                            <Button className="shadow-xl shadow-blue-500/20">
                                <Plus className="w-4 h-4 mr-2" /> List New Item
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {requests.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-700 transition-colors">
                        <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">All caught up!</h3>
                        <p className="text-slate-500 dark:text-slate-500 mt-2">No pending requests right now.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((rental, index) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col lg:flex-row gap-6 items-start lg:items-center group hover:border-blue-100 dark:hover:border-zinc-700 transition-colors"
                            >
                                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                        src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                        alt={rental.product?.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{rental.product?.name}</h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <User className="w-3 h-3 mr-1" />
                                                Requested by <span className="text-slate-900 dark:text-white font-medium ml-1">{rental.renter?.name}</span>
                                            </div>
                                            {rental.renter?.identityProof ? (
                                                <a 
                                                    href={rental.renter.identityProof} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline w-fit"
                                                >
                                                    View Renter's Govt ID
                                                </a>
                                            ) : (
                                                <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">No ID uploaded</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-1">
                                            <Calendar className="w-3 h-3 mr-2 text-slate-400 dark:text-slate-500" />
                                            <span>{new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 w-fit px-2 py-0.5 rounded">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            Earn ₹{rental.totalPrice}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start lg:justify-end gap-3">
                                        {rental.status === 'Pending' ? (
                                            <>
                                                <Button 
                                                    onClick={() => handleStatusUpdate(rental._id, "Approved")}
                                                    className="bg-green-600 hover:bg-green-700 shadow-green-600/20"
                                                    size="sm"
                                                >
                                                    <Check className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                                <Button 
                                                    onClick={() => handleStatusUpdate(rental._id, "Rejected")}
                                                    variant="danger"
                                                    size="sm"
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        ) : (
                                            <span className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                                rental.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
                                                rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300'
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
        </div>
    );
};

export default LenderDashboard;