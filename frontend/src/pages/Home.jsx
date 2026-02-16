import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Common function to fetch data
    const fetchProducts = async (searchTerm = "", categoryTerm = "") => {
        setLoading(true);
        try {
            // We pass the arguments directly so we don't have to wait for State to update
            const response = await getAllProducts(searchTerm, categoryTerm);
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search, category);
    };

    // --- NEW: Reset Function ---
    const handleClear = () => {
        setSearch("");      // Clear State
        setCategory("");    // Clear Category
        fetchProducts("", ""); // Fetch ALL products immediately
    };

    return (
        <div className="container mx-auto p-4">
            {/* Search & Filter Section */}
            <div className="bg-white p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 shadow-sm items-center border">
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full">
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-brand-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        Search
                    </button>
                </form>

                {/* Category Dropdown */}
                <select 
                    className="p-2 border rounded w-full md:w-48 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        // Optional: Auto-search when category changes
                        // fetchProducts(search, e.target.value); 
                    }}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Tools">Tools</option>
                </select>

                {/* --- NEW: Clear Button (Only shows if filters are active) --- */}
                {(search || category) && (
                    <button 
                        onClick={handleClear}
                        className="text-red-600 font-medium hover:text-red-800 px-4 py-2 border border-red-200 rounded hover:bg-red-50 transition"
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading marketplace...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="block group">
                                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition bg-white h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={product.productImage} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                            {product.category}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg mb-1 truncate text-gray-800">{product.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            <div className="text-gray-600 text-sm flex items-center gap-1">
                                                📍 {product.location}
                                            </div>
                                            <div className="text-blue-600 font-bold text-lg">
                                                ₹{product.pricePerDay}<span className="text-xs font-normal text-gray-500">/day</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <h3 className="text-xl font-medium text-gray-900">No items found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                            <button 
                                onClick={handleClear}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                View all products
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;