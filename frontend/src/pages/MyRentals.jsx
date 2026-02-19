import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign } from 'lucide-react';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20 dark:bg-black dark:text-white transition-colors">Loading your rentals...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 dark:bg-black transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">My Rentals</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Track the status of items you've requested to rent.</p>
                    </motion.div>
                </div>

                {rentals.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-700 transition-colors"
                    >
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-900 dark:text-white">No rentals yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Start exploring products to borrow gear.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {rentals.map((rental, index) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-5 items-center hover:shadow-md dark:hover:shadow-none dark:hover:border-zinc-700 transition-all"
                            >
                                <div className="w-24 h-24 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                        alt={rental.product?.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                
                                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{rental.product?.name}</h3>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(rental.startDate).toLocaleDateString()} to {new Date(rental.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                                                Total: ₹{rental.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                                            rental.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
                                            rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400' :
                                            'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300'
                                        }`}>
                                            Status: {rental.status}
                                        </span>
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

export default MyRentals;