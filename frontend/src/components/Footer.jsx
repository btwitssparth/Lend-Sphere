import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Github, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    
                    {/* Brand & About Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 outline-none focus:outline-none mb-6">
                            {/* Matching Logo SVG */}
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="shrink-0 outline-none">
                                <defs>
                                    <linearGradient id="brandGradientFooter" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0ea5e9" />
                                        <stop offset="1" stopColor="#0284c7" />
                                    </linearGradient>
                                </defs>
                                <path d="M20 5C11.7157 5 5 11.7157 5 20" stroke="url(#brandGradientFooter)" strokeWidth="3" strokeLinecap="round" />
                                <path d="M35 20C35 28.2843 28.2843 35 20 35" stroke="url(#brandGradientFooter)" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="20" cy="20" r="6" fill="url(#brandGradientFooter)" />
                                <circle cx="20" cy="5" r="2.5" fill="#0ea5e9" />
                                <circle cx="35" cy="20" r="2.5" fill="#0284c7" />
                                <circle cx="20" cy="35" r="2.5" fill="#0ea5e9" />
                                <circle cx="5" cy="20" r="2.5" fill="#0284c7" />
                            </svg>
                            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">
                                LendSphere
                            </span>
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
                            The world's leading peer-to-peer lending marketplace. Rent everyday items, save money, and earn by sharing your gear securely.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                <Mail className="w-4 h-4 mr-3 text-zinc-400" />
                                support@lendsphere.com
                            </div>
                            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                                <MapPin className="w-4 h-4 mr-3 text-zinc-400" />
                                Mumbai, Maharashtra, India
                            </div>
                        </div>
                    </div>

                    {/* Quick Links: Marketplace */}
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Marketplace</h4>
                        <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Categories</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Electronics</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Furniture</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Vehicles</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links: Support */}
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link to="/disputes" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resolution Center</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Trust & Safety</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Renter Guarantee</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Lender Protection</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links: Company */}
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        &copy; {currentYear} LendSphere. Built with ❤️ for Mumbai.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                        <a href="#" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-500 transition-colors">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;