import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SocialAuth } from './SocialAuth';
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../Context/AuthContext";

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.user, data.accessToken);
      toast.success("Welcome back to LendSphere!");
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
          Welcome Back
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
          Enter your details to access your account.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="input-modern pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="input-modern pl-12 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
          <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
            rememberMe ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50' : 'border-zinc-200 dark:border-zinc-800'
          }`}>
            {rememberMe && <Check className="w-3 h-3 text-white dark:text-zinc-900" strokeWidth={4} />}
          </div>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 select-none">Remember me</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-lg font-black shadow-lg shadow-zinc-200 dark:shadow-none mt-4"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
          <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400">Or continue with</span>
        </div>
      </div>

      <SocialAuth />

      <p className="text-center mt-10 text-zinc-500 dark:text-zinc-400 font-medium">
        New to LendSphere?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-zinc-900 dark:text-zinc-50 font-black hover:underline underline-offset-4"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default LoginForm;