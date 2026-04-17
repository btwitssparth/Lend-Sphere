import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import SupportBot from './components/SupportBot';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import MyRentals from './pages/MyRentals';
import LenderDashboard from './pages/LenderDashboard';
import UploadId from './pages/UploadId';
import PublicProfile from './pages/PublicProfile';
import AdminDashboard from './pages/AdminDashboard';
import RenterDisputes from './pages/RenterDisputes';
import Wishlist from "./pages/Wishlist";
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* The Global Notification Toaster - Dark Mode Styled */}
      <Toaster 
        position="top-center" 
        toastOptions={{ 
            style: { 
              background: '#161616', 
              color: '#F5F0E8', 
              borderRadius: '10px', 
              border: '1px solid #2A2A2A' 
            },
            success: {
              iconTheme: { primary: '#C9A96E', secondary: '#161616' }
            }
        }} 
      />

      <Navbar />
      <SupportBot /> 

      <main className="flex-grow pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage initialView="login" />} />
          <Route path="/register" element={<AuthPage initialView="register" />} />
          
          {/* Product Routes */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile/:id" element={<PublicProfile />} />

          {/* Protected Routes */}
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          
          {/* Dashboard Routes */}
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/lender-dashboard" element={<LenderDashboard />} />
          
          {/* Verification */}
          <Route path="/upload-id" element={<UploadId />} />
          
          {/* Admin & Resolution Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/disputes" element={<RenterDisputes />} />

          {/* Wishlist Route */}
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;