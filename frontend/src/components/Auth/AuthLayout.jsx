import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Heart } from 'lucide-react';

export const AuthLayout = ({ children, isLogin }) => {
  const transition = { type: "spring", stiffness: 100, damping: 20, mass: 1 };

  const BrandLogo = ({ isDarkBg = false }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="shrink-0">
      <circle cx="20" cy="20" r="6" className={isDarkBg ? "fill-white" : "fill-zinc-900 dark:fill-zinc-50"} />
      <path d="M20 5C11.7157 5 5 11.7157 5 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
      <path d="M35 20C35 28.2843 28.2843 35 20 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={isDarkBg ? "text-zinc-400" : "text-zinc-400 dark:text-zinc-600"} />
      <circle cx="20" cy="5" r="2.5" className="fill-amber-500" />
      <circle cx="35" cy="20" r="2.5" className={isDarkBg ? "fill-zinc-400" : "fill-zinc-400 dark:fill-zinc-600"} />
      <circle cx="20" cy="35" r="2.5" className={isDarkBg ? "fill-zinc-400" : "fill-zinc-400 dark:fill-zinc-600"} />
      <circle cx="5" cy="20" r="2.5" className="fill-amber-500" />
    </svg>
  );

  const SidePanelContent = () => (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
              className="w-full h-full object-cover opacity-40 grayscale"
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop" 
              alt="LendSphere Marketplace"
          />
        </div>
        <div className="absolute inset-0 bg-zinc-950/60" />
        
        <div className="absolute inset-0 p-12 xl:p-20 flex flex-col justify-between z-20">
            <div className="flex items-center gap-3">
                <BrandLogo isDarkBg={true} />
                <span className="text-2xl font-black tracking-tighter text-white">LendSphere</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <h3 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                  Join the Future of <br />
                  <span className="text-zinc-500">Shared Ownership.</span>
                </h3>
                
                <div className="grid grid-cols-1 gap-6 mt-12">
                  {[
                    { icon: Shield, text: "Secure Peer-to-Peer Transactions" },
                    { icon: Zap, text: "Instant Access to Premium Gear" },
                    { icon: Heart, text: "Sustainable Community Sharing" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-zinc-300 font-medium text-lg">{item.text}</p>
                    </div>
                  ))}
                </div>
            </motion.div>

            <div className="text-zinc-500 text-sm font-medium">
              &copy; 2026 LendSphere Inc. All rights reserved.
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 overflow-hidden relative font-sans">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="p-6 flex items-center gap-3">
            <BrandLogo />
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">LendSphere</span>
        </div>
        <div className="flex-1 px-6 py-8 flex flex-col justify-center">
           <div className="w-full max-w-sm mx-auto">
              {children}
           </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
          {/* Form Side */}
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 bg-white dark:bg-zinc-950 z-10 flex flex-col justify-center px-12 xl:px-32"
            initial={false}
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={transition}
          >
             <div className="w-full max-w-md mx-auto">
                {children}
             </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 z-20 overflow-hidden"
            initial={false}
            animate={{ x: isLogin ? "100%" : "0%" }}
            transition={transition}
          >
             <SidePanelContent />
          </motion.div>
      </div>
    </div>
  );
};