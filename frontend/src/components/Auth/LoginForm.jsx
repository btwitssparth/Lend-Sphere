import React, { useState } from 'react';
import { Mail, Lock, Check } from 'lucide-react';
import { Input } from '../Ui/Input';
import { Button } from '../Ui/Button';
import { SocialAuth } from './SocialAuth';
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../Context/AuthContext";

const LoginForm = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            login(data.user, data.accessToken);
        } catch (err) {
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                <p className="text-slate-600 mt-2">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToRegister} className="text-brand-600 hover:text-brand-700 font-medium">
                        Sign up
                    </button>
                </p>
            </div>

            <SocialAuth />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    id="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-5 w-5 text-slate-400" />}
                    required
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-5 w-5 text-slate-400" />}
                    required
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`
                                h-4 w-4 rounded border flex items-center justify-center transition-colors duration-200 
                                ${rememberMe ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'}
                            `}
                        >
                            {rememberMe && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </button>
                        <label onClick={() => setRememberMe(!rememberMe)} className="ml-2 block text-sm text-slate-700 cursor-pointer select-none">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <Button type="submit" fullWidth isLoading={loading}>
                    Sign in
                </Button>
            </form>
        </div>
    );
};

export default LoginForm;