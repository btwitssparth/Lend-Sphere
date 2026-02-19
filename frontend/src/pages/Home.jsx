import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Filter, AlertCircle, Star, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const QUICK_CATEGORIES = ['Cameras', 'Drones', 'Power Tools', 'Party Gear', 'Bicycles'];

const Hero = ({ search, setSearch, category, setCategory, handleSearch }) => (
    <div className="relative border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="relative px-6 py-20 md:py-28 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 text-left w-full">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-6 transition-colors shadow-sm"
                >
                    <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    Verified Local Lenders
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 transition-colors leading-[1.1]"
                >
                    Access premium gear. <br className="hidden lg:block" />
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium tracking-tight">Zero ownership required.</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed transition-colors"
                >
                    Join thousands of creators, builders, and adventurers borrowing exactly what they need, exactly when they need it.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-2xl"
                >
                    <form 
                        onSubmit={handleSearch}
                        className="flex flex-col sm:flex-row p-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 transition-all duration-200 mb-4"
                    >
                        <div className="flex-1 flex items-center px-4 h-14">
                            <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 mr-3" />
                            <input 
                                type="text" 
                                placeholder="What do you need today?" 
                                className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-base font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="h-px sm:h-8 sm:w-px bg-zinc-200 dark:bg-zinc-800 mx-2 my-2 sm:my-auto transition-colors"></div>
                        
                        <div className="sm:w-48 relative flex items-center">
                            <select 
                                className="w-full h-14 pl-3 pr-8 bg-transparent text-zinc-600 dark:text-zinc-300 outline-none cursor-pointer text-sm font-medium appearance-none hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" className="bg-white dark:bg-zinc-900">All Items</option>
                                <option value="Electronics" className="bg-white dark:bg-zinc-900">Electronics</option>
                                <option value="Furniture" className="bg-white dark:bg-zinc-900">Furniture</option>
                                <option value="Vehicles" className="bg-white dark:bg-zinc-900">Vehicles</option>
                                <option value="Fitness" className="bg-white dark:bg-zinc-900">Fitness</option>
                            </select>
                            <Filter className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-4 pointer-events-none" />
                        </div>
                        
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="h-14 rounded-lg px-8 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors shadow-none border-none font-semibold"
                        >
                            Find Gear
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-2 uppercase tracking-wider">Popular:</span>
                        {QUICK_CATEGORIES.map((cat, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCategory(cat)}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="hidden lg:block w-1/3">
                 <div className="relative w-full aspect-square rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm overflow-hidden">
                    <div className="w-full h-1/2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl mb-4 p-4 flex flex-col justify-end">
                        <div className="w-2/3 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm mb-2"></div>
                        <div className="w-1/3 h-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-sm"></div>
                    </div>
                    <div className="flex gap-4 h-[calc(50%-1rem)]">
                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl"></div>
                        <div className="flex-1 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center">
                            <ArrowRight className="w-8 h-8 text-white dark:text-zinc-900" />
                        </div>
                    </div>
                 </div>
            </div>

        </div>
    </div>
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (searchTerm = "", categoryTerm = "") => {
        setLoading(true);
        try {
            const response = await getAllProducts(searchTerm, categoryTerm);
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search, category);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Hero 
                search={search} 
                setSearch={setSearch} 
                category={category} 
                setCategory={setCategory} 
                handleSearch={handleSearch} 
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight transition-colors">Featured Listings</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg transition-colors">Equipment available in your neighborhood today.</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                        View Map
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-[420px] bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse transition-colors border border-zinc-200 dark:border-zinc-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {products.length > 0 ? (
                            products.map((product, index) => {
                                // Extract dynamic data safely
                                const ownerName = product.owner?.name || product.ownerName || "Local Lender";
                                const ownerAvatar = product.owner?.avatar || product.ownerAvatar;
                                const rating = product.rating || product.owner?.rating;

                                return (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -6 }}
                                        className="h-full"
                                    >
                                        <Link to={`/product/${product._id}`} className="group block h-full">
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 h-full flex flex-col hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
                                                
                                                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                                                    <img 
                                                        src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
                                                        {product.category}
                                                    </div>
                                                </div>
                                                
                                                <div className="p-5 flex flex-col flex-1">
                                                    
                                                    {/* DYNAMIC Lender Profile Snippet */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-zinc-700">
                                                                {ownerAvatar ? (
                                                                    <img src={ownerAvatar} alt={ownerName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                                                                        {ownerName.charAt(0).toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                                by {ownerName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
                                                            <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100" />
                                                            {rating ? Number(rating).toFixed(1) : "New"}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="font-extrabold text-xl text-zinc-900 dark:text-zinc-50 line-clamp-1 mb-2 group-hover:underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-4 transition-all">
                                                            {product.name}
                                                        </h3>
                                                        <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm font-medium transition-colors">
                                                            <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                                                            <span className="line-clamp-1">{product.location}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between transition-colors">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">₹{product.pricePerDay}</span>
                                                            <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">/day</span>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all duration-300 shadow-sm">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-32 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors transform rotate-3">
                                    <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 transition-colors">No gear found</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto text-lg transition-colors">We couldn't find any items matching your current filters. Try adjusting your search.</p>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-sm font-semibold" 
                                    onClick={() => {setSearch(""); setCategory(""); fetchProducts("","");}}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;