import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { getLenderRequests, getMyRentals } from '../api/rentals';
import { getDisputesAgainstMe } from '../api/dispute';
import {
  Menu, X, LogOut, LayoutDashboard, Package,
  PlusCircle, Bell, ShieldAlert, AlertTriangle,
  Heart, User, ChevronRight, Sun, Moon
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
    className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 mx-1
      ${danger
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50'
        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-50'
      }`}
  >
    <span className={`shrink-0 ${danger ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors'}`}>
      <Icon className="w-4 h-4" />
    </span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
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
      className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
    >
      <span className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${colorMap[notif.id] || 'bg-zinc-100 text-zinc-500'}`}>
        {notif.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">{notif.title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{notif.desc}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0 mt-1" />
    </Link>
  );
};

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

const DropdownCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 6, scale: 0.97 }}
    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
    className={`absolute right-0 mt-2.5 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/50 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
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

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useOutsideClick(profileRef, () => setProfileOpen(false));
  useOutsideClick(notifRef, () => setNotifOpen(false));

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
          notifs.push({ id: 'dispute-active', title: 'Action Required', desc: `${disputes.length} active dispute(s) filed against you.`, link: '/disputes', icon: <AlertTriangle className="w-4 h-4" /> });
        if (pending.length)
          notifs.push({ id: 'lender-pending', title: 'New Rental Requests', desc: `${pending.length} pending request(s) to review.`, link: '/lender-dashboard', icon: <Package className="w-4 h-4" /> });
        if (approved.length)
          notifs.push({ id: 'renter-approved', title: 'Request Approved', desc: `${approved.length} item(s) ready for pickup.`, link: '/my-rentals', icon: <Package className="w-4 h-4" /> });
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

  const hasDispute = notifications.some(n => n.id === 'dispute-active');

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          <Link to="/" className="flex items-center gap-2.5 outline-none group">
            <LogoMark />
            <span className="text-[15px] font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              LendSphere
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 mr-1 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all outline-none"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                {user.roles?.admin && (
                  <Link to="/admin">
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 hover:bg-red-100 transition-colors">
                      <ShieldAlert className="w-3.5 h-3.5" /> Admin
                    </span>
                  </Link>
                )}

                <Link to="/add-product">
                  <button className="flex items-center gap-1.5 h-9 px-4 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-colors">
                    <PlusCircle className="w-3.5 h-3.5" /> List Item
                  </button>
                </Link>

                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => toggle('notif')}
                    className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                      notifOpen ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    } text-zinc-600 dark:text-zinc-300 outline-none`}
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <DropdownCard className="w-[340px]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Notifications</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                              <Bell className="w-7 h-7 text-zinc-200 dark:text-zinc-700" />
                              <p className="text-sm text-zinc-400 dark:text-zinc-500">All caught up</p>
                            </div>
                          ) : (
                            notifications.map(n => <NotifItem key={n.id} notif={n} onClose={() => setNotifOpen(false)} />)
                          )}
                        </div>
                      </DropdownCard>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => toggle('profile')}
                    className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-xl border transition-all outline-none ${
                      profileOpen ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-black">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {user.name?.split(' ')[0]}
                    </span>
                    {hasDispute && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <DropdownCard className="w-56 py-2">
                        <div className="px-4 pb-3 pt-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user.email}</p>
                        </div>
                        <MenuItem to={`/profile/${user._id}`} icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                        <MenuItem to="/lender-dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setProfileOpen(false)} badge={notifications.some(n => n.id === 'lender-pending')} />
                        <MenuItem to="/my-rentals" icon={Package} label="My Rentals" onClick={() => setProfileOpen(false)} badge={notifications.some(n => n.id === 'renter-approved')} />
                        <MenuItem to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setProfileOpen(false)} />
                        <MenuItem to="/disputes" icon={ShieldAlert} label="Resolution Center" onClick={() => setProfileOpen(false)} badge={hasDispute} />
                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-4 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl mx-auto transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 outline-none"
                          style={{ width: 'calc(100% - 8px)', marginLeft: 4 }}
                        >
                          <LogOut className="w-4 h-4 shrink-0" /> Log Out
                        </button>
                      </DropdownCard>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><button className="h-9 px-4 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">Log in</button></Link>
                <Link to="/register"><button className="h-9 px-4 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors">Sign up</button></Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors outline-none">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {user && (
              <Link to="/lender-dashboard" className="relative w-9 h-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors outline-none"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;