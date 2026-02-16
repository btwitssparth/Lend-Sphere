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

function App() {
  const { loading } = useAuth();

  // 1. Loading Screen (Kept from your original code)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-600 animate-pulse">Loading LendSphere...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Main Content Area */}
      <main>
        <Routes>
          {/* Public Routes (Everyone can see) */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Protected Route (Lenders Only) */}
          {/* You could add a wrapper here to check user.roles.lending later */}
          <Route path="/add-product" element={<AddProduct />} />

          {/* Catch all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;