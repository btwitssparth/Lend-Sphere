import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import api from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../components/Ui/Button';
import { MapPin, User, Calendar, ShieldCheck, Tag } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
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
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Delete this item?")) {
            await deleteProduct(id);
            navigate('/');
        }
    };

    const handleRent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rentals/request', { productId: product._id, startDate, endDate });
            alert("Request sent!");
            navigate('/my-rentals');
        } catch (error) {
            alert("Failed to request rental");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const isOwner = user && product.owner?._id === user._id;

    return (
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Images & Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl overflow-hidden shadow-sm aspect-video bg-slate-100">
                        <img src={product.productImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                                <div className="flex items-center text-slate-500">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {product.location}
                                </div>
                            </div>
                            {isOwner && (
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => navigate(`/edit-product/${product._id}`)}>Edit</Button>
                                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-b border-slate-100 py-6 flex gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <User />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Listed by</p>
                                    <p className="font-semibold text-slate-900">{product.owner?.name || "LendSphere User"}</p>
                                </div>
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    <Tag />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Category</p>
                                    <p className="font-semibold text-slate-900">{product.category}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3">Description</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Booking Card */}
                <div className="relative">
                    <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 lg:p-8">
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-3xl font-bold text-slate-900">₹{product.pricePerDay}</span>
                            <span className="text-slate-500 mb-1">/ day</span>
                        </div>

                        {!isOwner ? (
                            <form onSubmit={handleRent} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                        <input type="date" required className="w-full p-3 border rounded-xl bg-slate-50" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                                        <input type="date" required className="w-full p-3 border rounded-xl bg-slate-50" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                    </div>
                                </div>
                                <Button className="w-full py-4 text-lg" type="submit">
                                    Request to Rent
                                </Button>
                                <p className="text-xs text-center text-slate-400 mt-2">You won't be charged yet</p>
                            </form>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl text-center text-slate-600">
                                This is your listing. Check the Dashboard for requests.
                            </div>
                        )}
                        
                        <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>LendSphere Protection Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;