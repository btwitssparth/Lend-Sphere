import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Github, Mail, MapPin, ArrowRight } from 'lucide-react';

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="shrink-0">
    <circle cx="20" cy="20" r="6" className="fill-zinc-900 dark:fill-zinc-50" />
    <path d="M20 5C11.7157 5 5 11.7157 5 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" />
    <path d="M35 20C35 28.2843 28.2843 35 20 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-zinc-400 dark:text-zinc-600" />
    <circle cx="20" cy="5" r="2.5" className="fill-amber-500" />
    <circle cx="35" cy="20" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
    <circle cx="20" cy="35" r="2.5" className="fill-zinc-400 dark:fill-zinc-600" />
    <circle cx="5" cy="20" r="2.5" className="fill-amber-500" />
  </svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pt-20 pb-10">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    
                    {/* Brand & About Section */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <LogoMark />
                            <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                LendSphere
                            </span>
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8 font-medium">
                            Empowering communities through shared ownership. Rent what you need, earn from what you have.
                        </p>
                        
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Facebook, Github].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50 mb-8">Marketplace</h4>
                        <ul className="space-y-4">
                            {['Electronics', 'Furniture', 'Vehicles', 'Fitness', 'Tools'].map((item) => (
                                <li key={item}>
                                    <Link to={`/?category=${item}`} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50 mb-8">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Safety Guide', 'Lender Protection', 'Renter Guarantee', 'Disputes'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="lg:col-span-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50 mb-8">Stay Connected</h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 font-medium">
                            Subscribe to our newsletter for the latest updates and featured gear.
                        </p>
                        <form className="relative group">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="input-modern pr-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-zinc-400 font-bold">
                        &copy; {currentYear} LendSphere Inc. <span className="mx-2 text-zinc-200 dark:text-zinc-800">•</span> Built with ❤️ for Mumbai
                    </p>
                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-zinc-400">
                        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Privacy</Link>
                        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Terms</Link>
                        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;