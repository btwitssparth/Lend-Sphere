import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/products';
import ProductMap from '../components/ProductMap'; 
import { 
  Search, SlidersHorizontal, Map as MapIcon, Grid, MapPin, 
  ArrowRight, ShieldCheck, Zap, Globe, Star, ChevronRight,
  Smartphone, Sofa, Car, Dumbbell, Hammer, Laptop, IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: "Electronics", icon: Laptop },
  { name: "Furniture", icon: Sofa },
  { name: "Vehicles", icon: Car },
  { name: "Fitness", icon: Dumbbell },
  { name: "Tools", icon: Hammer },
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid'); 
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        location: ''
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.category !== 'All') queryParams.append('category', filters.category);
            if (filters.location) queryParams.append('location', filters.location);
            
            const response = await getAllProducts(queryParams.toString());
            setProducts(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300); 
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <Zap className="w-3 h-3 mr-1.5" /> Fast & Secure Rentals
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1] mb-6">
                                Rent Anything, <br />
                                <span className="text-zinc-400 dark:text-zinc-600">Anytime.</span>
                            </h1>
                            <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed">
                                Join the community-driven marketplace for high-quality gear. 
                                Rent what you need, lend what you don't.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="#explore" className="btn-primary group">
                                    Explore Products
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/add-product" className="btn-secondary">
                                    List Your Product
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/5 rounded-full blur-3xl pointer-events-none -z-10" />
            </section>

            {/* Search & Categories Section */}
            <section id="explore" className="py-12 bg-white dark:bg-zinc-950">
                <div className="container-custom">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 -mt-24 relative z-20">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="Search for cameras, tools, or anything..." 
                                    className="input-modern pl-12 bg-white dark:bg-zinc-950 border-transparent focus:border-blue-500"
                                    value={filters.search} 
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 lg:w-1/3">
                                <div className="flex-1 relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        placeholder="Location..." 
                                        className="input-modern pl-12 bg-white dark:bg-zinc-950 border-transparent focus:border-blue-500"
                                        value={filters.location} 
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <button 
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                                    className="btn-secondary px-4 min-w-[120px] bg-white dark:bg-zinc-950"
                                >
                                    {viewMode === 'grid' ? <MapIcon className="w-4 h-4 mr-2" /> : <Grid className="w-4 h-4 mr-2" />}
                                    {viewMode === 'grid' ? 'Map' : 'List'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Scroll */}
                    <div className="mt-12 overflow-x-auto pb-4 no-scrollbar">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setFilters({ ...filters, category: 'All' })}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all shrink-0 font-semibold ${
                                    filters.category === 'All' 
                                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900' 
                                    : 'bg-zinc-50 border-transparent text-zinc-600 hover:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400'
                                }`}
                            >
                                All Items
                            </button>
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.name}
                                    onClick={() => setFilters({ ...filters, category: cat.name })}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all shrink-0 font-semibold ${
                                        filters.category === cat.name 
                                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900' 
                                        : 'bg-zinc-50 border-transparent text-zinc-600 hover:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400'
                                    }`}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-20 bg-white dark:bg-zinc-950">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                {filters.category === 'All' ? 'Featured Items' : `${filters.category} Near You`}
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                                Handpicked rentals with top-rated security.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                            <span className="text-zinc-900 dark:text-zinc-50">{products.length}</span> Results
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/3] rounded-3xl skeleton" />
                                    <div className="h-6 w-2/3 rounded-lg skeleton" />
                                    <div className="h-4 w-full rounded-lg skeleton" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800">
                            <div className="w-20 h-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-6">
                                <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">No results found</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                We couldn't find any products matching your filters. Try clearing them to see all items.
                            </p>
                            <button 
                                onClick={() => setFilters({search: '', category: 'All', location: ''})}
                                className="btn-primary"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <Link 
                                        to={`/product/${product._id}`} 
                                        className="group block rounded-3xl overflow-hidden transition-all duration-300 h-full border border-zinc-100 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                                            <img 
                                                src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-sm font-black text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                                ₹{product.pricePerDay}<span className="text-[10px] text-zinc-400 uppercase ml-1">/Day</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                                                    {product.category || 'Rental'}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-500 ml-auto">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-black">4.9</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center text-sm font-medium text-zinc-400 dark:text-zinc-500">
                                                <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                                                <span className="truncate">{product.location}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-[600px] rounded-[40px] overflow-hidden border border-zinc-100 dark:border-zinc-900 relative z-0">
                            <ProductMap products={products} />
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container-custom">
                    <div className="max-w-2xl mb-20">
                        <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                            How LendSphere <span className="text-zinc-400 dark:text-zinc-600">Works.</span>
                        </h2>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                            A simple, secure process to get what you need or earn from your assets.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                          { title: "Find & Request", desc: "Browse thousands of items nearby. Check availability and request to rent with a single click.", icon: Search },
                          { title: "Secure Booking", desc: "Once the lender approves, your payment is held securely. Connect via chat to arrange pickup.", icon: ShieldCheck },
                          { title: "Pick Up & Use", desc: "Meet the lender, verify the item, and enjoy! Return it when you're done and leave a review.", icon: Globe }
                        ].map((step, idx) => (
                          <div key={idx} className="relative group">
                            <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                              <step.icon className="w-8 h-8 text-zinc-900 dark:text-zinc-50" />
                            </div>
                            <div className="absolute top-8 left-16 w-full h-px border-t border-dashed border-zinc-200 dark:border-zinc-800 hidden md:block -z-10" />
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight flex items-center">
                              <span className="mr-3 text-zinc-200 dark:text-zinc-800 text-4xl italic">0{idx+1}</span>
                              {step.title}
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                              {step.desc}
                            </p>
                          </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="flex-1 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-8 leading-[1.1]">
                                    Have items sitting idle? <br />
                                    <span className="text-blue-600 dark:text-blue-400">Start earning today.</span>
                                </h2>
                                <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-12 font-medium leading-relaxed">
                                    Join thousands of people earning extra income by sharing their gear. 
                                    Secure payments and verified users guaranteed.
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <Link to="/add-product" className="btn-primary px-10 py-4 text-lg shadow-2xl shadow-zinc-200 dark:shadow-none">
                                        List Your Item Now
                                    </Link>
                                    <Link to="/how-it-works" className="btn-secondary px-10 py-4 text-lg">
                                        Learn More
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                        
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="aspect-square rounded-[60px] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop" 
                                        alt="Premium Gear" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating elements for premium feel */}
                                <div className="absolute -top-8 -right-8 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 animate-bounce-slow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                            <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Earnings</p>
                                            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">₹12,450</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 animate-bounce-slow delay-150">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Verified</p>
                                            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">Top Lender</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Background Decorations */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 dark:bg-blue-900/5 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;