import { useEffect, useState } from 'react';
import { getDisputesAgainstMe } from '../api/dispute';
import { AlertTriangle, ShieldAlert, ExternalLink } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import DisputeDetailsModal from '../components/DisputeDetailsModal';

const RenterDisputes = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchData = async () => {
        try {
            const res = await getDisputesAgainstMe();
            setDisputes(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openDetails = (dispute) => {
        setSelectedDispute(dispute);
        setIsDetailsOpen(true);
    };

    if (loading) return <div className="min-h-screen pt-28 flex justify-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-500">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Disputes Against Me</h1>
                        <p className="text-zinc-500">Respond to claims filed by lenders.</p>
                    </div>
                </div>

                {disputes.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No Active Disputes</h3>
                        <p className="text-zinc-500">You are a model renter! Keep it up.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {disputes.map((dispute) => (
                            <div key={dispute._id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{dispute.reason}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            dispute.status === 'Open' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>{dispute.status}</span>
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">"{dispute.description}"</p>
                                    
                                    <div className="flex items-center gap-4">
                                        <Button size="sm" onClick={() => openDetails(dispute)}>
                                            <ExternalLink className="w-4 h-4 mr-2" /> 
                                            {dispute.isResponseSubmitted ? "View Details" : "Respond Now"}
                                        </Button>
                                        {dispute.isResponseSubmitted && (
                                            <span className="text-xs font-bold text-green-600 flex items-center">
                                                Response Submitted ✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DisputeDetailsModal 
                isOpen={isDetailsOpen} 
                onClose={() => setIsDetailsOpen(false)} 
                dispute={selectedDispute}
                isRenterView={true} // 🔥 Special Flag
                onResponseSuccess={fetchData}
            />
        </div>
    );
};

export default RenterDisputes;