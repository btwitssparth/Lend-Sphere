import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { getLenderRequests, getMyRentals } from '../api/rentals';
import { getDisputesAgainstMe } from '../api/dispute';
import {
  Menu, X, LogOut, LayoutDashboard, Package,
  PlusCircle, Bell, ShieldAlert, AlertTriangle,
  Heart, User, ChevronRight, Sun, Moon, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const MenuItem = ({ to, icon: Icon, label, badge, danger, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-150 mx-1
      ${danger
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50'
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
      }`}
  >
    <span className={`shrink-0 ${danger ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors'}`}>
      <Icon className="w-4 h-4" />
    </span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
    )}
  </Link>
);

const NotifItem = ({ notif, onClose }) => {
  const colorMap = {
    'dispute-active': 'text-red-500 bg-red-50 dark:bg-red-950/50',
    'lender-pending': 'text-blue-500 bg-blue-50 dark:bg-blue-950/50',
    'renter-approved': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
  };
  return (
    <Link
      to={notif.link}
      onClick={onClose}
      className="flex items-start gap-3 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-b border-zinc-100 dark:border-zinc-900 last:border-0"
    >
      <span className={`mt-0.5 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[notif.id] || 'bg-zinc-100 text-zinc-500'}`}>
        {notif.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-snug">{notif.title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-medium">{notif.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 shrink-0 mt-1" />
    </Link>
  );
};

const DropdownCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={`absolute right-0 mt-3 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="shrink-0">
    <circle cx="20" cy="20" r="6" className="fill-zinc-900 dark:fill-zinc-50" />
    <path d="M20 5C11.7157 5 5 11.7157 5 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
    <path d="M35 20C35 28.2843 28.2843 35 20 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-zinc-400 dark:text-zinc-600" />
    <circle cx="20" cy="5" r="2.5" className="fill-amber-500" />
    <circle cx="35" cy="20" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
    <circle cx="20" cy="35" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
    <circle cx="5" cy="20" r="2.5" className="fill-amber-500" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth() || {};
  const { isDarkMode, toggleTheme } = useTheme() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useOutsideClick(profileRef, () => setProfileOpen(false));
  useOutsideClick(notifRef, () => setNotifOpen(false));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [lenderRes, renterRes, disputeRes] = await Promise.all([
          getLenderRequests().catch(() => ({ data: { data: [] } })),
          getMyRentals().catch(() => ({ data: { data: [] } })),
          getDisputesAgainstMe().catch(() => ({ data: { data: [] } })),
        ]);
        const pending  = lenderRes.data.data.filter(r => r.status === 'Pending');
        const approved = renterRes.data.data.filter(r => r.status === 'Approved');
        const disputes = disputeRes.data.data.filter(d => ['Open', 'Under Review'].includes(d.status));
        const notifs = [];
        if (disputes.length)
          notifs.push({ id: 'dispute-active', title: 'Action Required', desc: `${disputes.length} active dispute(s) filed against you.`, link: '/disputes', icon: <AlertTriangle className="w-5 h-5" /> });
        if (pending.length)
          notifs.push({ id: 'lender-pending', title: 'New Rental Requests', desc: `${pending.length} pending request(s) to review.`, link: '/lender-dashboard', icon: <Package className="w-5 h-5" /> });
        if (approved.length)
          notifs.push({ id: 'renter-approved', title: 'Request Approved', desc: `${approved.length} item(s) ready for pickup.`, link: '/my-rentals', icon: <Package className="w-5 h-5" /> });
        setNotifications(notifs);
      } catch { /* silent */ }
    };
    fetch();
    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
  }, [user]);

  const handleLogout = () => { if(logout) logout(); setProfileOpen(false); navigate('/login'); };
  const toggle = (panel) => {
    setProfileOpen(p => panel === 'profile' ? !p : false);
    setNotifOpen(p => panel === 'notif' ? !p : false);
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm' 
        : 'h-20 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <LogoMark />
          <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
            LendSphere
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              <Link to="/add-product">
                <button className="btn-primary h-10 px-5 text-sm font-black flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> List Item
                </button>
              </Link>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => toggle('notif')}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                    notifOpen ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <DropdownCard className="w-[380px]">
                      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
                        <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Notifications</span>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
                              <Bell className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
                            </div>
                            <p className="text-sm text-zinc-400 font-bold">All caught up!</p>
                          </div>
                        ) : (
                          notifications.map(n => <NotifItem key={n.id} notif={n} onClose={() => setNotifOpen(false)} />)
                        )}
                      </div>
                    </DropdownCard>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => toggle('profile')}
                  className={`flex items-center gap-3 h-10 pl-1.5 pr-4 rounded-xl border transition-all ${
                    profileOpen ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${profileOpen ? 'bg-white/20 dark:bg-zinc-900/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-black tracking-tight">{user.name?.split(' ')[0]}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <DropdownCard className="w-64 py-3">
                      <div className="px-6 pb-4 pt-2 border-b border-zinc-100 dark:border-zinc-900 mb-2">
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{user.email}</p>
                      </div>
                      <MenuItem to={`/profile/${user._id}`} icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                      <MenuItem to="/lender-dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setProfileOpen(false)} />
                      <MenuItem to="/my-rentals" icon={Package} label="My Rentals" onClick={() => setProfileOpen(false)} />
                      <MenuItem to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setProfileOpen(false)} />
                      <div className="h-px bg-zinc-100 dark:bg-zinc-900 mx-4 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-[calc(100%-16px)] mx-2 flex items-center gap-3 px-4 py-2.5 text-sm font-black rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </DropdownCard>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm font-black">Log in</Link>
              <Link to="/register" className="btn-primary h-10 px-6 text-sm font-black">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-lg"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {user ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/lender-dashboard" className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                      <LayoutDashboard className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-black">Dashboard</span>
                    </Link>
                    <Link to="/my-rentals" className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                      <Package className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-black">My Rentals</span>
                    </Link>
                  </div>
                  <Link to="/add-product" className="block w-full btn-primary py-4 text-center font-black">
                    List an Item
                  </Link>
                  <button onClick={handleLogout} className="block w-full py-4 text-center text-red-600 font-black">
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" className="w-full py-4 text-center text-zinc-900 dark:text-zinc-50 font-black border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    Log in
                  </Link>
                  <Link to="/register" className="w-full py-4 text-center bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black rounded-2xl">
                    Get Started
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