import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist } from '../api/users';
import { motion } from 'framer-motion';
import { Heart, MapPin, IndianRupee, PackageX } from 'lucide-react';
import { Button } from '../components/Ui/Button';

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await getWishlist();
                setProducts(res.data.data); // Assuming backend sends { data: [products] }
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-white dark:bg-zinc-950 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <Heart className="w-6 h-6 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">My Wishlist</h1>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <PackageX className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your wishlist is empty</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">Save items you want to rent later.</p>
                        <Link to="/">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`} className="group">
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative">
                                        <img 
                                            src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full">
                                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">{product.name}</h3>
                                        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {product.location}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="font-black text-zinc-900 dark:text-zinc-50 flex items-center">
                                                <IndianRupee className="w-3.5 h-3.5" />
                                                {product.pricePerDay}<span className="text-xs font-medium text-zinc-400 ml-0.5">/day</span>
                                            </p>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;