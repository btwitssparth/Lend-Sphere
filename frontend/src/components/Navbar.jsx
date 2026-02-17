import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleSwitchRole = async () => {
    try {
      await api.post('/users/switch-role');
      alert("Role switched successfully! Refreshing profile...");
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to switch role", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return null; 

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-brand-600">LendSphere</span>
            </Link>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium">
              Browse
            </Link>

            {user ? (
              <>
                {/* --- NEW LINK: My Rentals (Visible to everyone logged in) --- */}
                <Link to="/my-rentals" className="text-slate-600 hover:text-slate-900 font-medium">
                  My Rentals
                </Link>

                {/* --- Lender Specific Links --- */}
                {user.roles?.lending && (
                  <>
                    {/* --- NEW LINK: Lender Dashboard --- */}
                    <Link to="/lender-dashboard" className="text-slate-600 hover:text-slate-900 font-medium">
                      Lender Dashboard
                    </Link>

                    <Link 
                      to="/add-product" 
                      className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 ml-2"
                    >
                      + List Item
                    </Link>
                  </>
                )}

                {/* User Dropdown / Info */}
                <div className="flex items-center space-x-3 ml-4 border-l pl-4 border-slate-200">
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                    <span className="text-xs text-slate-500">
                      {user.roles?.lending ? "Lender Mode" : "Renter Mode"}
                    </span>
                  </div>

                  <button 
                    onClick={handleSwitchRole}
                    className="text-xs text-blue-600 hover:underline"
                    title="Switch between Renter and Lender"
                  >
                    Switch Role
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-red-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* Guest Links */
              <div className="space-x-4">
                <Link to="/login" className="text-slate-900 font-medium hover:text-brand-600">
                  Login
                </Link>
                <Link 
                  to="/login" 
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;