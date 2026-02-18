import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Plus, LayoutDashboard, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="font-bold text-lg">L</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">LendSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Explore
            </Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/my-rentals" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  My Rentals
                </Link>
                
                {user.roles?.lending && (
                  <Link to="/lender-dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}

                <div className="h-5 w-px bg-slate-200"></div>

                <div className="flex items-center gap-4">
                  {user.roles?.lending && (
                    <Button 
                        size="sm" 
                        onClick={() => navigate('/add-product')}
                        className="rounded-lg h-9 px-4 text-sm bg-slate-900 hover:bg-slate-800 shadow-none border border-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" /> List Item
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                        <User className="w-4 h-4" />
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                    >
                        Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">Log in</Button>
                </Link>
                <Link to="/login">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-md">Explore</Link>
              {user ? (
                <>
                  <Link to="/my-rentals" className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-md">My Rentals</Link>
                  <Link to="/lender-dashboard" className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-md">Dashboard</Link>
                  <div className="border-t border-slate-100 my-2 pt-2">
                      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Log out</button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link to="/login" className="flex justify-center py-2 border border-slate-200 rounded-lg text-sm font-medium">Log in</Link>
                    <Link to="/signup" className="flex justify-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Sign up</Link>
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