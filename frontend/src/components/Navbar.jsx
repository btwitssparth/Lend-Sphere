import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { Moon, Sun, Menu, X, LogOut, LayoutDashboard, Package, PlusCircle } from 'lucide-react';
import { Button } from './Ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/login');
    };

    return (
        // Change your <nav> tag to this:
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
                        
                        {/* Dark Mode Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/add-product">
                                    <Button variant="outline" className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors">
                                        <PlusCircle className="w-4 h-4 mr-2" /> List Item
                                    </Button>
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-slate-800"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
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
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full"
                        >
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

                                    <Link to="/add-product" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <PlusCircle className="w-5 h-5 mr-3 text-blue-500" /> List an Item
                                    </Link>
                                    <Link to="/lender-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <LayoutDashboard className="w-5 h-5 mr-3 text-blue-500" /> Dashboard
                                    </Link>
                                    <Link to="/my-rentals" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Package className="w-5 h-5 mr-3 text-blue-500" /> My Rentals
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