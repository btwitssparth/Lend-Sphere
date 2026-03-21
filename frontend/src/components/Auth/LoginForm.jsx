import React, { useState } from 'react';
import { Mail, Lock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SocialAuth } from './SocialAuth';
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../Context/AuthContext";

const T = {
  text: '#F5F0E8',
  muted: '#6B6560',
  accent: '#C9A96E',
  surface2: '#161616',
  border: '#1E1E1E',
  borderLight: '#2A2A2A',
  danger: '#E05252',
};

const DarkInput = ({ icon: Icon, label, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div>
      <label style={{ color: T.muted }} className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={14} color={focused ? T.accent : T.muted}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
        )}
        <input
          {...props}
          type={isPassword && showPass ? 'text' : props.type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-11 rounded-lg text-sm outline-none transition-colors placeholder-[#3A3530]"
          style={{
            background: T.surface2,
            border: `1px solid ${focused ? T.accent : T.border}`,
            color: T.text,
            caretColor: T.accent,
            paddingLeft: Icon ? 40 : 16,
            paddingRight: isPassword ? 40 : 16,
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ color: T.muted }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold hover:text-[#F5F0E8] transition-colors"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
};

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      toast.success("Welcome back!");
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 style={{ color: T.text }} className="text-2xl font-black tracking-tight">Welcome back</h1>
        <p style={{ color: T.muted }} className="mt-1.5 text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} style={{ color: T.accent }} className="font-bold hover:underline">
            Sign up
          </button>
        </p>
      </div>

      <SocialAuth />

      <div className="relative flex items-center gap-3">
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ color: T.muted }} className="text-xs font-medium shrink-0">or continue with email</span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <DarkInput
          id="email" type="email" label="Email address"
          placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail} required
        />
        <DarkInput
          id="password" type="password" label="Password"
          placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock} required
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
            <div
              style={{
                width: 16, height: 16, borderRadius: 4,
                background: rememberMe ? T.accent : 'transparent',
                border: `1px solid ${rememberMe ? T.accent : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
              }}
            >
              {rememberMe && <Check size={10} color="#0A0A0A" strokeWidth={3} />}
            </div>
            <span style={{ color: T.muted }} className="text-xs font-medium select-none">Remember me</span>
          </div>
          <a href="#" style={{ color: T.accent }} className="text-xs font-bold hover:underline">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#161616' : T.accent, color: loading ? T.muted : '#0A0A0A' }}
          className="w-full h-11 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors mt-2"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;