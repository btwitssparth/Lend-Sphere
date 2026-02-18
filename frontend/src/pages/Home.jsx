import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Filter } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const Hero = ({ search, setSearch, category, setCategory, handleSearch }) => (
    <div className="relative border-b border-slate-200 bg-slate-50/50">
        {/* Subtle Modern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative px-6 py-20 md:py-32 max-w-5xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 mb-8"
            >
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                The smarter way to rent gear
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
            >
                Rent what you need, <br className="hidden md:block" />
                <span className="text-blue-600">earn from what you own.</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
                Connect with locals to rent premium cameras, tools, and electronics. 
                Save money and reduce waste by borrowing instead of buying.
            </motion.p>
            
            {/* Minimal Search Bar */}
            <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row p-1.5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 max-w-2xl mx-auto"
            >
                <div className="flex-1 flex items-center px-4 h-12">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search for drones, DSLRs, bikes..." 
                        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 text-sm md:text-base font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-px md:h-8 md:w-px bg-slate-200 mx-2 my-2 md:my-auto"></div>
                <div className="md:w-48 relative flex items-center">
                    <select 
                        className="w-full h-12 pl-3 pr-8 bg-transparent text-slate-600 outline-none cursor-pointer text-sm md:text-base font-medium appearance-none hover:text-slate-900 transition-colors"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                    <Filter className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
                </div>
                <Button type="submit" size="lg" className="h-12 rounded-xl px-8 shadow-sm">Search</Button>
            </motion.form>
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
        <div className="min-h-screen bg-white">
            <Hero 
                search={search} 
                setSearch={setSearch} 
                category={category} 
                setCategory={setCategory} 
                handleSearch={handleSearch} 
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Featured Listings</h2>
                        <p className="text-slate-500 mt-2">Discover the most popular items available for rent near you.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-[320px] bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link to={`/product/${product._id}`} className="group block h-full">
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:border-blue-200">
                                            {/* Image container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                                                <img 
                                                    src={product.productImage} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                                                    {product.category}
                                                </div>
                                            </div>
                                            
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                                    <div className="flex items-center text-slate-500 text-sm">
                                                        <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                        {product.location}
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-lg font-bold text-slate-900">₹{product.pricePerDay}</span>
                                                        <span className="text-sm text-slate-500">/day</span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                                <p className="text-slate-500 mb-6">We couldn't find what you were looking for.</p>
                                <Button variant="outline" onClick={() => {setSearch(""); setCategory(""); fetchProducts("","");}}>
                                    Clear Filters
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