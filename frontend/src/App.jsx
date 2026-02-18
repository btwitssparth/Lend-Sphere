import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

// Components
import Navbar from "./components/Navbar";

// Pages
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";
import MyRentals from "./pages/MyRentals";
import LenderDashboard from "./pages/LenderDashboard";
import UploadID from "./pages/UploadId"; // <--- Imported Verification Page

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-600 animate-pulse">Loading LendSphere...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Secured Routes */}
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/lender-dashboard" element={<LenderDashboard />} />

          {/* Verification Route */}
          <Route path="/upload-id" element={<UploadID />} />

          {/* Catch all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;