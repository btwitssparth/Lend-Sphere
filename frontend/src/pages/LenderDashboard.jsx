import { useEffect, useState, useMemo } from 'react';
import { getLenderRequests, updateRentalStatus } from '../api/rentals';
import { getMyDisputes } from '../api/dispute';
import { useTheme } from '../Context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, User, Calendar, IndianRupee, Check, X, MessageCircle, 
    Package, CheckCircle, Star, Lock, TrendingUp, Wallet, 
    Clock, Activity, MapPin, AlertTriangle, Scale, ExternalLink,
    ChevronRight, ArrowUpRight, ArrowDownRight, MoreVertical, ShieldCheck, Layers
} from 'lucide-react'; 
import { Link } from 'react-router-dom';
import ChatBox from '../components/Chat/Chatbox';
import ReportDamageModal from '../components/ReportDamageModal'; 
import DisputeDetailsModal from '../components/DisputeDetailsModal'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const LenderDashboard = () => {
    const { isDarkMode } = useTheme();
    const [requests, setRequests] = useState([]);
    const [disputes, setDisputes] = useState([]); 
    const [activeTab, setActiveTab] = useState("requests"); 
    const [loading, setLoading] = useState(true);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeRentalId, setActiveRentalId] = useState(null);
    const [activeRentalStatus, setActiveRentalStatus] = useState(null);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedRentalForReport, setSelectedRentalForReport] = useState(null);

    const [isDisputeDetailsOpen, setIsDisputeDetailsOpen] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, dispRes] = await Promise.all([
                getLenderRequests(),
                getMyDisputes()
            ]);
            setRequests(reqRes.data.data);
            setDisputes(dispRes.data.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (rentalId, newStatus) => {
        try {
            await updateRentalStatus(rentalId, newStatus);
            toast.success(`Rental ${newStatus.toLowerCase()} successfully`);
            fetchData(); 
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const openChat = (rental) => {
        setActiveRentalId(rental._id);
        setActiveRentalStatus(rental.status);
        setIsChatOpen(true);
    };

    const openReportModal = (rental) => {
        setSelectedRentalForReport(rental);
        setIsReportModalOpen(true);
    };

    const openDisputeDetails = (dispute) => {
        setSelectedDispute(dispute);
        setIsDisputeDetailsOpen(true);
    };

    const stats = useMemo(() => {
        let totalEarned = 0;
        let activeCount = 0;
        let pendingCount = 0;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthly = {};
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
                if (monthly[m] !== undefined) monthly[m] += req.totalPrice;
            } else if (req.status === 'Approved' || req.status === 'Active') {
                activeCount++;
            } else if (req.status === 'Pending') {
                pendingCount++;
            }
        });

        return {
            totalEarned, activeCount, pendingCount,
            chartData: Object.keys(monthly).map(k => ({ name: k, earnings: monthly[k] }))
        };
    }, [requests]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xl">
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-zinc-900 dark:text-zinc-50 font-black text-lg">₹{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                            Lender Dashboard
                        </h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                            Track your earnings and manage your active rentals.
                        </p>
                    </div>
                    <Link to="/add-product" className="btn-primary group shadow-xl shadow-zinc-200 dark:shadow-none">
                        <Plus className="w-5 h-5 mr-2" /> List New Item
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Revenue', value: `₹${stats.totalEarned}`, icon: Wallet, trend: '+12%', color: 'blue' },
                        { label: 'Active Rentals', value: stats.activeCount, icon: Activity, trend: '+2', color: 'green' },
                        { label: 'Pending Requests', value: stats.pendingCount, icon: Clock, trend: 'Action Required', color: 'amber' }
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-7 h-7 text-zinc-900 dark:text-zinc-50" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                    stat.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-zinc-400" /> Revenue Overview
                            </h3>
                            <select className="bg-transparent text-xs font-bold uppercase tracking-widest text-zinc-400 border-none focus:ring-0 cursor-pointer">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isDarkMode ? "#f4f4f5" : "#18181b"} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={isDarkMode ? "#f4f4f5" : "#18181b"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272a" : "#e4e4e7"} opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#71717a' : '#a1a1aa', fontSize: 10, fontWeight: 800 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#71717a' : '#a1a1aa', fontSize: 10, fontWeight: 800 }} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="earnings" stroke={isDarkMode ? "#f4f4f5" : "#18181b"} strokeWidth={3} fillOpacity={1} fill="url(#revenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Actions / Recent Activity */}
                    <div className="p-8 rounded-[40px] bg-zinc-900 dark:bg-zinc-50 border border-zinc-900 dark:border-zinc-50 shadow-xl overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white dark:text-zinc-900 tracking-tight mb-8">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link to="/add-product" className="flex items-center justify-between p-4 rounded-2xl bg-white/10 dark:bg-zinc-900/5 hover:bg-white/20 dark:hover:bg-zinc-900/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-zinc-900/10 flex items-center justify-center">
                                            <Plus className="w-5 h-5 text-white dark:text-zinc-900" />
                                        </div>
                                        <span className="font-bold text-white dark:text-zinc-900">Add New Listing</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button onClick={() => setActiveTab('disputes')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 dark:bg-zinc-900/5 hover:bg-white/20 dark:hover:bg-zinc-900/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <span className="font-bold text-white dark:text-zinc-900">Resolve Disputes</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link to="/settings" className="flex items-center justify-between p-4 rounded-2xl bg-white/10 dark:bg-zinc-900/5 hover:bg-white/20 dark:hover:bg-zinc-900/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-zinc-900/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white dark:text-zinc-900" />
                                        </div>
                                        <span className="font-bold text-white dark:text-zinc-900">Profile Settings</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-zinc-100 dark:border-zinc-800 mb-10 overflow-x-auto no-scrollbar">
                    {['requests', 'disputes'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                                activeTab === tab 
                                    ? "text-zinc-900 dark:text-zinc-50" 
                                    : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-400"
                            }`}
                        >
                            {tab === 'requests' ? 'Rental Requests' : 'Reported Issues'}
                            {activeTab === tab && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "requests" ? (
                        <motion.div 
                            key="requests"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {requests.length === 0 ? (
                                <div className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors">
                                    <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2">No incoming requests</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">Keep your gear listed and well-priced to attract renters.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {requests.map((rental, idx) => (
                                        <motion.div 
                                            key={rental._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-6 md:p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
                                        >
                                            <div className="flex flex-col lg:flex-row gap-8">
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 shrink-0">
                                                    <img src={rental.product?.productImages?.[0] || rental.product?.productImage || '/default-placeholder.png'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
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
                                                                    <User className="w-4 h-4 mr-2 text-zinc-400" />
                                                                    Renter: <span className="text-zinc-900 dark:text-zinc-100 font-bold ml-1">{rental.renter?.name}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm font-medium text-zinc-500">
                                                                    <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                                                                    {new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}
                                                                </div>
                                                                {rental.product?.quantity > 1 && (
                                                                    <div className="flex items-center text-sm font-medium text-zinc-500">
                                                                        <Layers className="w-4 h-4 mr-2 text-zinc-400" />
                                                                        Total Inventory: <span className="text-zinc-900 dark:text-zinc-100 font-bold ml-1">{rental.product.quantity}</span>
                                                                    </div>
                                                                )}
                                                                {rental.renterAddress && (
                                                                    <div className="flex items-center text-sm font-medium text-zinc-500">
                                                                        <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                                                                        {rental.renterAddress}
                                                                    </div>
                                                                )}
                                                                {rental.renter?.identityProof && (
                                                                    <div className="flex items-center text-sm font-medium">
                                                                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                                                                        <a 
                                                                            href={rental.renter.identityProof} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                                                        >
                                                                            View Govt ID
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Revenue</p>
                                                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">₹{rental.totalPrice}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                                        {rental.status === 'Pending' ? (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(rental._id, "Approved")} className="btn-primary py-2 text-sm">
                                                                    <Check className="w-4 h-4 mr-2" /> Approve Request
                                                                </button>
                                                                <button onClick={() => handleStatusUpdate(rental._id, "Cancelled")} className="btn-secondary py-2 text-sm text-red-600 hover:bg-red-50">
                                                                    <X className="w-4 h-4 mr-2" /> Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(rental.status === 'Approved' || rental.status === 'Active') && (
                                                                    <button onClick={() => handleStatusUpdate(rental._id, "Completed")} className="btn-primary py-2 text-sm bg-blue-600 dark:bg-blue-500">
                                                                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Returned
                                                                    </button>
                                                                )}
                                                                {['Active', 'Completed'].includes(rental.status) && (
                                                                    <button onClick={() => openReportModal(rental)} className="btn-secondary py-2 text-sm text-amber-600 border-amber-100 hover:bg-amber-50">
                                                                        <AlertTriangle className="w-4 h-4 mr-2" /> Report Issue
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                        <button onClick={() => openChat(rental)} className="btn-secondary py-2 text-sm ml-auto">
                                                            <MessageCircle className="w-4 h-4 mr-2" /> Message Renter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="disputes"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {disputes.length === 0 ? (
                                <div className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors">
                                    <Scale className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2">No reported issues</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">Great job! All your rentals are going smoothly.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {disputes.map((dispute, idx) => (
                                        <motion.div 
                                            key={dispute._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-8 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-100 dark:hover:border-red-900/30 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-center justify-center shrink-0">
                                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-1">{dispute.reason}</h3>
                                                            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                                                                <span>Claim Amount: <span className="text-zinc-900 dark:text-zinc-100 font-bold">₹{dispute.claimAmount}</span></span>
                                                                <span>•</span>
                                                                <span>Date: {new Date(dispute.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                            dispute.status === 'Open' ? 'bg-red-50 text-red-600 border-red-200' :
                                                            'bg-green-50 text-green-600 border-green-200'
                                                        }`}>
                                                            {dispute.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-6 line-clamp-2">
                                                        "{dispute.description}"
                                                    </p>
                                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black uppercase text-zinc-500">
                                                                {dispute.defendant?.name?.[0]}
                                                            </div>
                                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{dispute.defendant?.name}</span>
                                                        </div>
                                                        <button onClick={() => openDisputeDetails(dispute)} className="btn-secondary py-2 text-sm group">
                                                            View Full Details <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ChatBox 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                rentalId={activeRentalId}
                rentalStatus={activeRentalStatus}
            />

            <ReportDamageModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
                rental={selectedRentalForReport}
                onSuccess={fetchData} 
            />

            <DisputeDetailsModal 
                isOpen={isDisputeDetailsOpen} 
                onClose={() => setIsDisputeDetailsOpen(false)} 
                dispute={selectedDispute}
            />
        </div>
    );
};

export default LenderDashboard;