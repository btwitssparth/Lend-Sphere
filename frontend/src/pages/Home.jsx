import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import ProductMap from '../components/ProductMap'; // 🔥 Import the Map
import { Search, SlidersHorizontal, Map as MapIcon, Grid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["All", "Electronics", "Furniture", "Vehicles", "Fitness", "Tools"];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // View Toggle State (Grid vs Map)
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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero / Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-3"
                        >
                            Rent Anything, <span className="text-blue-600 dark:text-blue-500">Anywhere.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-lg text-zinc-600 dark:text-zinc-400 font-medium"
                        >
                            Discover everyday items from people nearby.
                        </motion.p>
                    </div>

                    {/* View Toggle (Grid / Map) */}
                    <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-sm">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'grid' 
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                            }`}
                        >
                            <Grid className="w-4 h-4" /> List
                        </button>
                        <button 
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'map' 
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                            }`}
                        >
                            <MapIcon className="w-4 h-4" /> Map
                        </button>
                    </div>
                </div>

                {/* Search and Filters Bar */}
                <div className="bg-white dark:bg-zinc-900 p-2 sm:p-3 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-10 flex flex-col sm:flex-row gap-3 transition-colors relative z-20">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input 
                            type="text" 
                            name="search" 
                            placeholder="What are you looking for?" 
                            className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 font-medium transition-all"
                            value={filters.search} onChange={handleFilterChange}
                        />
                    </div>
                    
                    <div className="hidden md:flex gap-3">
                        <select 
                            name="category" 
                            className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-transparent focus:border-blue-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-50 font-medium cursor-pointer appearance-none min-w-[160px]"
                            value={filters.category} onChange={handleFilterChange}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        
                        <input 
                            type="text" name="location" placeholder="City or area..." 
                            className="px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-transparent focus:border-blue-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 font-medium w-48"
                            value={filters.location} onChange={handleFilterChange}
                        />
                    </div>

                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 px-5 py-3.5 rounded-xl font-bold"
                    >
                        <SlidersHorizontal className="w-5 h-5" /> Filters
                    </button>
                </div>

                {/* Mobile Filters Dropdown */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-8 space-y-4 shadow-lg overflow-hidden"
                        >
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Category</label>
                                <select 
                                    name="category" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none"
                                    value={filters.category} onChange={handleFilterChange}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Location</label>
                                <input 
                                    type="text" name="location" placeholder="E.g. Mumbai" 
                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none"
                                    value={filters.location} onChange={handleFilterChange}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area (Grid or Map) */}
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-200 dark:border-red-800 mb-8">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                        <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">No items found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your filters or search term.</p>
                        <button 
                            onClick={() => setFilters({search: '', category: 'All', location: ''})}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    // Toggle between Grid and Map based on state
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="w-full relative z-0"
                        >
                            <ProductMap products={products} />
                        </motion.div>
                    )
                )}

            </div>
        </div>
    );
};

export default Home;