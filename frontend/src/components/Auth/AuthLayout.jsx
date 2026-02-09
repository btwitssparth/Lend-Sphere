import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, isLogin }) => {
  const transition = { type: "spring", stiffness: 70, damping: 15, mass: 1 };

  const BrandLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-brand-600">
      <defs>
        <linearGradient id="brandGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#brandGradient)" strokeWidth="3" className="opacity-20" />
      <path d="M20 5C11.7157 5 5 11.7157 5 20" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 20C35 28.2843 28.2843 35 20 35" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="20" r="6" fill="url(#brandGradient)" />
      <circle cx="20" cy="5" r="2.5" fill="#0ea5e9" />
      <circle cx="35" cy="20" r="2.5" fill="#0284c7" />
      <circle cx="20" cy="35" r="2.5" fill="#0ea5e9" />
      <circle cx="5" cy="20" r="2.5" fill="#0284c7" />
    </svg>
  );

  const SidePanelContent = () => (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
              className="w-full h-full object-cover opacity-60"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
              alt="LendSphere Network"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/10" />
        <div className="absolute bottom-0 left-0 right-0 p-12 xl:p-16 z-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <h3 className="text-3xl font-bold text-white mb-4">
                  The World's Lending Marketplace
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                  Experience the freedom of access over ownership. 
                  Connect with a global community to rent, lend, and secure your assets effortlessly.
                </p>
            </motion.div>
        </div>
    </div>
  );

  const LogoAndFooter = ({ content }) => (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full justify-center py-12">
        <div className="flex items-center gap-3 mb-12">
            <BrandLogo />
            <span className="text-2xl font-bold tracking-tight text-slate-900">LendSphere</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
            {content}
        </div>

        <div className="mt-8 flex justify-between items-center text-xs text-slate-400">
            <p>&copy; 2026 LendSphere Inc.</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden relative font-sans">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="flex-1 bg-white px-6 py-8 flex flex-col justify-center">
           <LogoAndFooter content={children} />
        </div>
        <div className="h-64 relative overflow-hidden">
            <SidePanelContent />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 bg-white z-10 flex flex-col px-12 xl:px-24"
            initial={false}
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={transition}
          >
             <LogoAndFooter content={children} />
          </motion.div>

          <motion.div
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-slate-900 z-20 overflow-hidden"
            initial={false}
            animate={{ x: isLogin ? "0%" : "-100%" }}
            transition={transition}
          >
             <SidePanelContent />
          </motion.div>
      </div>
    </div>
  );
};