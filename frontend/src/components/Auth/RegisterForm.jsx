import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SocialAuth } from './SocialAuth';
import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../Context/AuthContext";

const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser({ 
                name: formData.fullName, 
                email: formData.email, 
                password: formData.password 
            });
            login(data.user, data.accessToken);
            toast.success("Welcome to LendSphere!");
            navigate('/');
        } catch (err) {
            toast.error(err.message || "Registration failed");
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
                    Create Account
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
                    Join the community and start sharing today.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            id="fullName"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="input-modern pl-12"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="input-modern pl-12"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="input-modern pl-12 pr-12"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                            Confirm
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="input-modern pl-12 pr-12"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-lg font-black shadow-lg shadow-zinc-200 dark:shadow-none mt-4 group"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        <span className="flex items-center justify-center">
                            Create Account
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
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
                Already have an account?{" "}
                <button
                    onClick={onSwitchToLogin}
                    className="text-zinc-900 dark:text-zinc-50 font-black hover:underline underline-offset-4"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
};

export default RegisterForm;