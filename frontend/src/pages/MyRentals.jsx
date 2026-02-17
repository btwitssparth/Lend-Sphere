import { useEffect, useState } from 'react';
import { getMyRentals } from '../api/rentals';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await getMyRentals();
                setRentals(res.data.data);
            } catch (error) {
                console.error("Error fetching rentals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    if (loading) return <div className="text-center py-10">Loading your rentals...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">My Rentals</h1>
            
            {rentals.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-gray-500 text-lg">You haven't rented anything yet.</p>
                    <a href="/" className="text-blue-600 font-medium mt-2 inline-block hover:underline">
                        Browse Marketplace
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {rentals.map((rental) => (
                        <div key={rental._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-md">
                            
                            {/* Product Info */}
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 mb-1">
                                    {rental.product?.name || "Unknown Item"}
                                </h3>
                                <div className="text-sm text-slate-500 space-y-1">
                                    <p>📅 {new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}</p>
                                    <p className="font-medium text-slate-700">Total Cost: <span className="text-blue-600">₹{rental.totalPrice}</span></p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                                    rental.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    rental.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                    {rental.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRentals;