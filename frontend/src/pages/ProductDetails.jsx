import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import api from '../api/axios'; // We need this for the Rent API call later

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Rental State
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleRent = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/rentals/request', {
                productId: product._id,
                startDate,
                endDate
            });
            alert("Rental Request Sent! Check your email/dashboard.");
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "Rental failed");
        }
    };

    if (loading) return <div className="text-center py-10">Loading details...</div>;
    if (!product) return <div className="text-center py-10">Product not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
                
                {/* Left: Image */}
                <div>
                    <img 
                        src={product.productImage} 
                        alt={product.name} 
                        className="w-full h-96 object-cover rounded-lg"
                    />
                </div>

                {/* Right: Details & Rent Form */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 uppercase tracking-wide">{product.category}</p>
                    <p className="text-2xl font-bold text-blue-600">₹{product.pricePerDay} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
                    
                    <p className="text-gray-700 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-3">Rent this Item</h3>
                        <form onSubmit={handleRent} className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">From</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 border rounded"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">To</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 border rounded"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
                            >
                                Request Rental
                            </button>
                        </form>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                        Owner: {product.owner?.name || "Verified Lender"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;