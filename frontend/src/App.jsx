import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import SupportBot from './components/SupportBot';
import Footer from './components/Footer'; // 🔥 1. IMPORT THE FOOTER HERE

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
import Wishlist from "./pages/Wishlist"
import Settings from './pages/Settings';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      <Navbar />
      
      <SupportBot /> 

      {/* The main tag has 'flex-grow' which pushes the footer to the bottom */}
      <main className="flex-grow">
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
          <Route path="/settings" element={<Settings />} />
          
          {/* Dashboard Routes */}
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/lender-dashboard" element={<LenderDashboard />} />
          
          {/* Verification */}
          <Route path="/upload-id" element={<UploadId />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/disputes" element={<RenterDisputes />} />

          {/* Wishlist Route */}
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>

      {/* 🔥 2. ADD THE FOOTER HERE */}
      <Footer />

    </div>
  );
}

export default App;