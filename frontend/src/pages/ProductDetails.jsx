import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products'; // Added deleteProduct
import api from '../api/axios';
import { useAuth } from '../Context/AuthContext'; // Import Auth to check owner

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
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

    // Handle Delete
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this item? This cannot be undone.")) {
            try {
                await deleteProduct(id);
                alert("Product deleted successfully");
                navigate('/');
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    // Handle Rent (Existing logic)
    const handleRent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rentals/request', { productId: product._id, startDate, endDate });
            alert("Rental Request Sent!");
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "Rental failed");
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!product) return <div className="text-center py-10">Product not found.</div>;

    // Check if current user is the owner
    const isOwner = user && product.owner?._id === user._id;

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <img src={product.productImage} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <p className="text-gray-500 uppercase tracking-wide">{product.category}</p>
                        </div>
                        
                        {/* OWNER ACTIONS */}
                        {isOwner && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => navigate(`/edit-product/${product._id}`)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-2xl font-bold text-blue-600">₹{product.pricePerDay} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>

                    {/* Rent Form (Hide if owner) */}
                    {!isOwner ? (
                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold mb-3">Rent this Item</h3>
                            <form onSubmit={handleRent} className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">From</label>
                                        <input type="date" className="w-full p-2 border rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">To</label>
                                        <input type="date" className="w-full p-2 border rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">Request Rental</button>
                            </form>
                        </div>
                    ) : (
                        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            💡 You own this item. You can edit details or remove it from the marketplace.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;