import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import this
import { Input } from '../Ui/Input';
import { Button } from '../Ui/Button';
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
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate(); // <--- 2. Initialize hook

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
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
            
            // <--- 3. Navigate to Home immediately after success
            navigate('/');
            
        } catch (err) {
            alert(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ... keep your existing JSX ...
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
                <p className="text-slate-600 mt-2">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-brand-600 hover:text-brand-700 font-medium">
                        Log in
                    </button>
                </p>
            </div>

            <SocialAuth />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-400">Or sign up with</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="fullName"
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<User className="h-5 w-5 text-slate-400" />}
                    required
                />

                <Input
                    id="email"
                    type="email"
                    label="Email address"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail className="h-5 w-5 text-slate-400" />}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<Lock className="h-5 w-5 text-slate-400" />}
                        required
                    />

                    <Input
                        id="confirmPassword"
                        type="password"
                        label="Confirm"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={<Lock className="h-5 w-5 text-slate-400" />}
                        required
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" fullWidth isLoading={loading} className="group h-12">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;