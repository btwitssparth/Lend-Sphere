import { useEffect, useState, useMemo } from 'react';
import { getLenderRequests, updateRentalStatus } from '../api/rentals';
import { motion } from 'framer-motion';
// 🔥 Added MapPin for the address icon
import { Plus, User, Calendar, DollarSign, Check, X, MessageCircle, Package, CheckCircle, Star, Lock, TrendingUp, Wallet, Clock, Activity, MapPin } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import { Link } from 'react-router-dom';
import ChatBox from '../components/Chat/Chatbox';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LenderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // 🔥 SMART ANALYTICS ENGINE 🔥
    const stats = useMemo(() => {
        let totalEarned = 0;
        let activeCount = 0;
        let pendingCount = 0;

        const monthly = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const today = new Date();
        for(let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            monthly[months[d.getMonth()]] = 0; 
        }

        requests.forEach(req => {
            if (req.status === 'Completed') {
                totalEarned += req.totalPrice;
                const date = new Date(req.updatedAt || req.createdAt);
                const m = months[date.getMonth()];
                if (monthly[m] !== undefined) {
                    monthly[m] += req.totalPrice;
                }
            } else if (req.status === 'Approved' || req.status === 'Active') {
                activeCount++;
            } else if (req.status === 'Pending') {
                pendingCount++;
            }
        });

        return {
            totalEarned,
            activeCount,
            pendingCount,
            chartData: Object.keys(monthly).map(k => ({ name: k, earnings: monthly[k] }))
        };
    }, [requests]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl">
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-zinc-900 dark:text-zinc-50 font-black text-lg">₹{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Lender Dashboard</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Manage your business and track your revenue.</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Link to="/add-product">
                            <Button size="lg" className="rounded-xl w-full md:w-auto">
                                <Plus className="w-5 h-5 mr-2" /> List New Item
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Analytics Section */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold tracking-wider uppercase mb-1">Total Earnings</p>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">₹{stats.totalEarned}</h3>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold tracking-wider uppercase mb-1">Active Rentals</p>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{stats.activeCount}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold tracking-wider uppercase mb-1">Pending Requests</p>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{stats.pendingCount}</h3>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Area Chart */}
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[300px]">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-zinc-400" />
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">Revenue Overview (Last 6 Months)</h3>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} className="dark:stopColor-zinc-100 dark:stopOpacity-30" />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} className="dark:stopColor-zinc-100 dark:stopOpacity-0" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="earnings" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" className="dark:stroke-zinc-100" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-6">Manage Requests</h3>

                {requests.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 transition-colors">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-3">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">No incoming requests</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Keep your gear listed and well-priced to attract renters.</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {requests.map((rental, index) => (
                            <motion.div 
                                key={rental._id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors overflow-hidden"
                            >
                                {/* Main Rental Info Row */}
                                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center w-full">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                        <img 
                                            src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} 
                                            alt={rental.product?.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-center">
                                        <div className="md:col-span-5">
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-1 line-clamp-1">{rental.product?.name}</h3>
                                            <div className="flex flex-col gap-1.5 mt-2">
                                                
                                                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Requested by <span className="text-zinc-900 dark:text-zinc-100 font-bold ml-1">{rental.renter?.name}</span>
                                                </div>

                                                {/* 🔥 NEW: Show Renter Address */}
                                                {rental.renterAddress && (
                                                    <div className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                                        <MapPin className="w-4 h-4 mr-2 text-zinc-400 shrink-0 mt-0.5" />
                                                        <span>Usage Location: <span className="text-zinc-900 dark:text-zinc-100 font-bold ml-1">{rental.renterAddress}</span></span>
                                                    </div>
                                                )}
                                                
                                                {/* ID Privacy Lock */}
                                                {rental.renter?.identityProof && (
                                                    ['Pending', 'Approved', 'Active'].includes(rental.status) ? (
                                                        <a 
                                                            href={rental.renter.identityProof} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline w-fit ml-6"
                                                        >
                                                            View Renter's Govt ID
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500 ml-6 flex items-center gap-1">
                                                            <Lock className="w-3 h-3" /> ID Hidden for Privacy
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

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
                                                        onClick={() => handleStatusUpdate(rental._id, "Cancelled")}
                                                        variant="danger"
                                                        size="sm"
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <X className="w-4 h-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap border shrink-0 ${
                                                        rental.status === 'Approved' || rental.status === 'Active' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100' : 
                                                        rental.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                                        rental.status === 'Rejected' || rental.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' :
                                                        'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                                    }`}>
                                                        {rental.status}
                                                    </span>
                                                    
                                                    {/* Mark Returned Button */}
                                                    {(rental.status === 'Approved' || rental.status === 'Active') && (
                                                        <Button 
                                                            onClick={() => handleStatusUpdate(rental._id, "Completed")} 
                                                            className="bg-blue-600 text-white hover:bg-blue-700 border-none dark:bg-blue-600 shadow-md shadow-blue-600/20" 
                                                            size="sm"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" /> Mark Returned
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Display Section */}
                                {rental.isReviewed && rental.review && (
                                    <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 w-full flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Renter Feedback</span>
                                            <div className="flex items-center">
                                                {[...Array(rental.review.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                ))}
                                                {[...Array(5 - rental.review.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-800 dark:text-zinc-200 italic font-medium">"{rental.review.comment}"</p>
                                    </div>
                                )}
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
        </div>
    );
};

export default LenderDashboard;