import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';
import { motion } from 'framer-motion';
import { Calendar, Package, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await getMyRentals();
                setRentals(res.data.data);
            } catch (error) {
                console.error("Error fetching rentals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Rejected': return <XCircle className="w-4 h-4 mr-1" />;
            default: return <Clock className="w-4 h-4 mr-1" />;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading your journey...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 max-w-5xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-bold text-slate-900 mb-2">My Rentals</h1>
                <p className="text-slate-500">Track your current and past adventures.</p>
            </motion.div>
            
            {rentals.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
                >
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No rentals yet</h3>
                    <p className="text-slate-500 mb-6">Explore the marketplace to find your first item.</p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                        Browse Items
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {rentals.map((rental, index) => (
                        <motion.div 
                            key={rental._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center"
                        >
                            <div className="w-full md:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                <img 
                                    src={rental.product?.productImage} 
                                    alt={rental.product?.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{rental.product?.name || "Unknown Item"}</h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mt-2 ${getStatusStyle(rental.status)}`}>
                                            {getStatusIcon(rental.status)} {rental.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">₹{rental.totalPrice}</p>
                                        <p className="text-xs text-slate-400">Total Cost</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-50">
                                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                        {new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                                        Payment Pending (Cash on Pickup)
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRentals;