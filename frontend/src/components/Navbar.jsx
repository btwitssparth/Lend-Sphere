import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { getLenderRequests, getMyRentals } from '../api/rentals'; 
import { getDisputesAgainstMe } from '../api/dispute'; 
import { 
    Moon, Sun, Menu, X, LogOut, LayoutDashboard, Package, 
    PlusCircle, Bell, Circle, ShieldAlert, AlertTriangle, Gavel, Heart 
} from 'lucide-react'; // 🔥 Added Heart icon
import { Button } from './Ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Notification States
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/login');
    };

    // Smart Notification Fetcher
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                // Fetch Disputes alongside Rentals and Requests
                const [lenderRes, renterRes, disputeRes] = await Promise.all([
                    getLenderRequests().catch(() => ({ data: { data: [] } })),
                    getMyRentals().catch(() => ({ data: { data: [] } })),
                    getDisputesAgainstMe().catch(() => ({ data: { data: [] } }))
                ]);

                const pendingRequests = lenderRes.data.data.filter(r => r.status === 'Pending');
                const approvedRentals = renterRes.data.data.filter(r => r.status === 'Approved');
                const activeDisputes = disputeRes.data.data.filter(d => d.status === 'Open' || d.status === 'Under Review');

                let newNotifs = [];

                if (activeDisputes.length > 0) {
                    newNotifs.push({
                        id: 'dispute-active',
                        title: 'Action Required',
                        desc: `You have ${activeDisputes.length} active dispute(s) filed against you.`,
                        link: '/disputes',
                        icon: <AlertTriangle className="w-4 h-4 text-red-500" />
                    });
                }

                if (pendingRequests.length > 0) {
                    newNotifs.push({
                        id: 'lender-pending',
                        title: 'New Rental Requests',
                        desc: `You have ${pendingRequests.length} pending request(s) to review.`,
                        link: '/lender-dashboard',
                        icon: <Package className="w-4 h-4 text-blue-500" />
                    });
                }

                if (approvedRentals.length > 0) {
                    newNotifs.push({
                        id: 'renter-approved',
                        title: 'Request Approved!',
                        desc: `You have ${approvedRentals.length} approved item(s) ready for pickup.`,
                        link: '/my-rentals',
                        icon: <Circle className="w-4 h-4 text-green-500" />
                    });
                }

                setNotifications(newNotifs);
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const toggleProfile = () => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); };
    const toggleNotif = () => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); };

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                            L
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
                            Lend<span className="text-blue-600">Sphere</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                
                                {/* ADMIN BUTTON (Desktop) */}
                                {user.roles?.admin === true && (
                                    <Link to="/admin">
                                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-red-600/20">
                                            <ShieldAlert className="w-4 h-4" />
                                            Admin
                                        </button>
                                    </Link>
                                )}

                                <Link to="/add-product">
                                    <Button variant="outline" className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors">
                                        <PlusCircle className="w-4 h-4 mr-2" /> List Item
                                    </Button>
                                </Link>

                                {/* Notification Bell */}
                                <div className="relative">
                                    <button 
                                        onClick={toggleNotif}
                                        className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} text-slate-600 dark:text-slate-300`}
                                    >
                                        <Bell className="w-5 h-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-black rounded-full animate-pulse"></span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    <AnimatePresence>
                                        {isNotifOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-between items-center">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
                                                    <span className="text-xs font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                                        {notifications.length} New
                                                    </span>
                                                </div>
                                                
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                                            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                                            You're all caught up!
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <Link 
                                                                key={notif.id} 
                                                                to={notif.link} 
                                                                onClick={() => setIsNotifOpen(false)}
                                                                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-50 dark:border-zinc-800/50 transition-colors last:border-0"
                                                            >
                                                                <div className="mt-0.5 shrink-0 bg-white dark:bg-zinc-800 p-2 rounded-full border border-slate-100 dark:border-zinc-700 shadow-sm">
                                                                    {notif.icon}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                                                                </div>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button 
                                        onClick={toggleProfile}
                                        className="flex items-center gap-2 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-slate-800"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-56 bg-white dark:bg-black rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                                </div>
                                                
                                                <Link to="/lender-dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                                                </Link>
                                                
                                                <Link to="/my-rentals" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    <Package className="w-4 h-4 mr-3" /> My Rentals
                                                </Link>

                                                {/* 🔥 NEW: Wishlist Link */}
                                                <Link to="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                    <Heart className="w-4 h-4 mr-3" /> My Wishlist
                                                </Link>

                                                <Link to="/disputes" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                    <Gavel className="w-4 h-4 mr-3" /> Resolution Center
                                                    {notifications.some(n => n.id === 'dispute-active') && (
                                                        <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                    )}
                                                </Link>

                                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                                                
                                                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                    <LogOut className="w-4 h-4 mr-3" /> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" className="dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">Log In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="shadow-lg shadow-blue-600/20">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button & Dark Mode */}
                    <div className="md:hidden flex items-center gap-2">
                        {user && (
                            <Link to="/lender-dashboard" className="relative p-2 text-slate-600 dark:text-slate-300">
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                )}
                            </Link>
                        )}

                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    {/* ADMIN BUTTON (Mobile) */}
                                    {user.roles?.admin === true && (
                                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-red-600 dark:text-red-400 font-bold rounded-xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                            <ShieldAlert className="w-5 h-5 mr-3" /> Admin Console
                                        </Link>
                                    )}

                                    <Link to="/add-product" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <PlusCircle className="w-5 h-5 mr-3 text-blue-500" /> List an Item
                                    </Link>
                                    <Link to="/lender-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <LayoutDashboard className="w-5 h-5 mr-3 text-blue-500" /> Dashboard
                                        {notifications.some(n => n.id === 'lender-pending') && <Circle className="w-2 h-2 ml-auto fill-red-500 text-red-500 animate-pulse" />}
                                    </Link>
                                    <Link to="/my-rentals" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Package className="w-5 h-5 mr-3 text-blue-500" /> My Rentals
                                        {notifications.some(n => n.id === 'renter-approved') && <Circle className="w-2 h-2 ml-auto fill-red-500 text-red-500 animate-pulse" />}
                                    </Link>

                                    {/* 🔥 NEW: Wishlist (Mobile) */}
                                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Heart className="w-5 h-5 mr-3 text-blue-500" /> My Wishlist
                                    </Link>

                                    <Link to="/disputes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Gavel className="w-5 h-5 mr-3 text-blue-500" /> Resolution Center
                                        {notifications.some(n => n.id === 'dispute-active') && <Circle className="w-2 h-2 ml-auto fill-red-500 text-red-500 animate-pulse" />}
                                    </Link>
                                    
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center p-3 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 mt-4 transition-colors">
                                        <LogOut className="w-5 h-5 mr-3" /> Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 pt-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full py-3 dark:border-slate-700 dark:text-slate-200 transition-colors">Log In</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full py-3 shadow-lg shadow-blue-600/20">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;