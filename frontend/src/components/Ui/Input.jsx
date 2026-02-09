import React, { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({ label, error, icon, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        <label htmlFor={props.id} className="block text-sm font-medium text-slate-600 mb-1.5">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={`
              appearance-none block w-full px-3 py-3
              bg-slate-50 border border-slate-200 text-slate-900 rounded-xl
              placeholder-slate-400
              focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 
              text-sm transition-all duration-200
              ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500 pr-10' : ''}
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
              {icon}
            </div>
          )}

          {/* Right Icon (Error or Password Toggle) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            ) : isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            ) : null}
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
});

Input.displayName = 'Input';