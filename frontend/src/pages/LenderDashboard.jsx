import { useEffect, useState } from 'react';
import { getLenderRequests, updateRentalStatus } from '../api/rentals';

const LenderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await getLenderRequests();
            setRequests(res.data.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (rentalId, newStatus) => {
        try {
            await updateRentalStatus(rentalId, newStatus);
            alert(`Request ${newStatus}!`);
            // Refresh the list to show updated status
            const res = await getLenderRequests();
            setRequests(res.data.data);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="text-center py-10">Loading incoming requests...</div>;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Lender Dashboard</h1>
                <a href="/add-product" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition">
                    + List New Item
                </a>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <h3 className="text-xl font-medium text-slate-700">No incoming requests</h3>
                    <p className="text-gray-500 mt-2">When users want to rent your items, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((rental) => (
                        <div key={rental._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            
                            {/* Request Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-slate-900">{rental.product?.name}</h3>
                                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium border border-blue-100">
                                        Earnings: ₹{rental.totalPrice}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p>👤 <span className="font-medium text-black">{rental.renter?.name}</span> wants to rent this.</p>
                                    <p>📅 {new Date(rental.startDate).toLocaleDateString()} ➝ {new Date(rental.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                {rental.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleStatusUpdate(rental._id, "Approved")}
                                            className="flex-1 lg:flex-none bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-sm hover:shadow"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(rental._id, "Cancelled")}
                                            className="flex-1 lg:flex-none bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-medium hover:bg-red-50 transition"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-4 py-2 rounded-lg text-sm font-bold w-full text-center lg:w-auto ${
                                        rental.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {rental.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LenderDashboard;