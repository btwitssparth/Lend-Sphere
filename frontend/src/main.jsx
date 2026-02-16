import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import this
import App from "./App";
import { AuthProvider } from "./Context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import "./App.css";

// Read from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 2. Wrap everything else inside BrowserRouter */}
      <BrowserRouter> 
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);