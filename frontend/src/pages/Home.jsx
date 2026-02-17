import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/Ui/Button';

// 1. Move Hero OUTSIDE the Home component
// 2. Receive the state variables as props
const Hero = ({ search, setSearch, category, setCategory, handleSearch }) => (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-16 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="relative px-8 py-24 md:py-32 text-center max-w-4xl mx-auto">
            <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium mb-6"
            >
                🚀 The Future of Peer-to-Peer Rental
            </motion.span>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            >
                Own less. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Experience more.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
                Rent high-quality gear from people nearby. From cameras to camping equipment, find what you need for your next adventure.
            </motion.p>
            
            {/* Search Bar */}
            <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl max-w-2xl mx-auto"
            >
                <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search for drones, cameras, etc..." 
                        className="w-full bg-transparent py-3 text-slate-900 outline-none placeholder:text-slate-400"
                        value={search}
                        // This will now update WITHOUT re-creating the whole Hero component
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                        <select 
                        className="w-full h-full px-4 py-3 bg-slate-50 rounded-xl text-slate-700 outline-none border-none cursor-pointer hover:bg-slate-100 transition"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                </div>
                <Button type="submit" size="lg" className="rounded-xl shadow-none">Search</Button>
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
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            {/* 3. Pass the props to the Hero component */}
            <Hero 
                search={search} 
                setSearch={setSearch} 
                category={category} 
                setCategory={setCategory} 
                handleSearch={handleSearch} 
            />

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Featured Listings</h2>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
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
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-64 overflow-hidden">
                                            <img 
                                                src={product.productImage} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-white/20">
                                                {product.category}
                                            </div>
                                        </div>
                                        
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center text-slate-500 text-sm mb-4">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {product.location}
                                            </div>
                                            
                                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <div>
                                                    <span className="text-2xl font-bold text-blue-600">₹{product.pricePerDay}</span>
                                                    <span className="text-sm text-slate-400 font-medium">/day</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                            <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
                            <Button variant="secondary" onClick={() => {setSearch(""); setCategory(""); fetchProducts("","");}}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;