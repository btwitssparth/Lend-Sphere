import { useAuth } from "./Context/AuthContext";
import AuthPage from "./pages/AuthPage"; // Import the new page

function App() {
  const { user, logout, loading } = useAuth();

  // 1. Show a loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-600 animate-pulse">Loading LendSphere...</h1>
      </div>
    );
  }

  // 2. If no user is logged in, show the new Auth Page (Login/Register)
  if (!user) {
    return <AuthPage />;
  }

  // 3. If user IS logged in, show the Dashboard (Temporary placeholder)
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Welcome back, <span className="text-brand-600">{user.name || user.email}</span>!
        </h1>
        <p className="text-slate-600 mb-6">You are now successfully logged in.</p>
        
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;