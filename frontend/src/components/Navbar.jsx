import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Menu, X, PlusCircle, LayoutDashboard, ShoppingBag } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              L
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">LendSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Explore
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/my-rentals" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  My Rentals
                </Link>
                
                {user.roles?.lending && (
                  <Link to="/lender-dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-3">
                  {user.roles?.lending && (
                    <Button size="sm" onClick={() => navigate('/add-product')}>
                      <PlusCircle className="w-4 h-4 mr-2" /> List Item
                    </Button>
                  )}
                  
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-black">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                        <User className="w-4 h-4" />
                      </div>
                    </button>
                    {/* Simple Dropdown could go here */}
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:underline ml-2">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link to="/login"><Button size="sm">Sign up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X /> : <Menu />}
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
            className="md:hidden bg-white border-t"
          >
            <div className="p-4 space-y-4">
              <Link to="/" className="block py-2 font-medium text-slate-700">Explore</Link>
              {user && (
                <>
                  <Link to="/my-rentals" className="block py-2 font-medium text-slate-700">My Rentals</Link>
                  <Link to="/lender-dashboard" className="block py-2 font-medium text-slate-700">Dashboard</Link>
                  <button onClick={handleLogout} className="block py-2 font-medium text-red-600 w-full text-left">Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;