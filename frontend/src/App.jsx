import { Routes, Route } from 'react-router-dom'; // 🔥 REMOVED 'BrowserRouter as Router'

// Components
import Navbar from './components/Navbar';
import SupportBot from './components/SupportBot';

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

// REMOVED LoginForm/RegisterForm imports if they aren't used directly here

function App() {
  return (
    // 🔥 REMOVED <ThemeProvider>, <AuthProvider>, and <Router> wrappers here.
    // They are already provided in main.jsx!
    
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      <Navbar />
      
      <SupportBot /> 

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
          
          {/* Dashboard Routes */}
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/lender-dashboard" element={<LenderDashboard />} />
          
          {/* Verification */}
          <Route path="/upload-id" element={<UploadId />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;