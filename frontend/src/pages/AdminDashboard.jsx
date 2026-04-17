import { useEffect, useState } from 'react';
import { getAllDisputes, processDispute } from '../api/admin';
import { ShieldAlert, Check, X, ExternalLink, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import DisputeDetailsModal from '../components/DisputeDetailsModal';
import DecisionModal from '../components/Decisionmodal';

const AdminDashboard = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Stats calculation
    const stats = {
        total: disputes.length,
        pending: disputes.filter(d => d.status === 'Open' || d.status === 'Under Review').length,
        resolved: disputes.filter(d => d.status === 'Resolved').length,
        rejected: disputes.filter(d => d.status === 'Rejected').length
    };

    // Modals State
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    const [decisionModal, setDecisionModal] = useState({
        isOpen: false,
        type: null, // 'Resolved' or 'Rejected'
        disputeId: null
    });

    const fetchDisputes = async () => {
        try {
            const res = await getAllDisputes();
            setDisputes(res.data.data);
        } catch (error) {
            console.error("Access Denied", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    // 1. Open the Decision Modal (Triggered from Table OR Details Modal)
    const promptDecision = (id, type) => {
        setDecisionModal({ isOpen: true, type, disputeId: id });
    };

    // 2. Submit the Decision with Comment
    const handleFinalDecision = async (comment) => {
        try {
            await processDispute(decisionModal.disputeId, decisionModal.type, comment);
            setDecisionModal({ isOpen: false, type: null, disputeId: null }); // Close decision modal
            setIsDetailsOpen(false); // Close details modal too
            fetchDisputes(); // Refresh list
        } catch (error) {
            alert("Failed to process dispute");
        }
    };

    const openDetails = (dispute) => {
        setSelectedDispute(dispute);
        setIsDetailsOpen(true);
    };

    if (loading) return <div className="min-h-screen pt-28 flex justify-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Admin Console</h1>
                        <p className="text-zinc-500 font-medium">Review and resolve platform disputes</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        label="Total Issues" 
                        value={stats.total} 
                        icon={Activity} 
                        color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                    />
                    <StatCard 
                        label="Pending Review" 
                        value={stats.pending} 
                        icon={Clock} 
                        color="text-orange-600 bg-orange-50 dark:bg-orange-900/20" 
                    />
                    <StatCard 
                        label="Resolved" 
                        value={stats.resolved} 
                        icon={CheckCircle2} 
                        color="text-green-600 bg-green-50 dark:bg-green-900/20" 
                    />
                    <StatCard 
                        label="Rejected" 
                        value={stats.rejected} 
                        icon={XCircle} 
                        color="text-red-600 bg-red-50 dark:bg-red-900/20" 
                    />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase text-zinc-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase text-zinc-500">Issue</th>
                                <th className="p-4 text-xs font-bold uppercase text-zinc-500">Claim</th>
                                <th className="p-4 text-xs font-bold uppercase text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {disputes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-zinc-500 font-medium">
                                        No issues reported yet.
                                    </td>
                                </tr>
                            ) : (
                                disputes.map((dispute) => (
                                    <tr key={dispute._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                                dispute.status === 'Open' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                dispute.status === 'Under Review' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                dispute.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-200' :
                                                dispute.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                                'bg-zinc-100 text-zinc-500 border-zinc-200'
                                            }`}>{dispute.status}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{dispute.reason}</div>
                                            <div className="text-xs text-zinc-500 truncate max-w-[200px]">{dispute.description}</div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{dispute.claimAmount}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => openDetails(dispute)}>
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                            
                                            {/* Table Actions */}
                                            {(dispute.status === 'Open' || dispute.status === 'Under Review') && (
                                                <>
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600 hover:bg-green-700 text-white border-none" 
                                                        onClick={() => promptDecision(dispute._id, 'Resolved')}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger" 
                                                        onClick={() => promptDecision(dispute._id, 'Rejected')}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 Pass isAdmin={true} and the promptDecision handler */}
            <DisputeDetailsModal 
                isOpen={isDetailsOpen} 
                onClose={() => setIsDetailsOpen(false)} 
                dispute={selectedDispute}
                isAdmin={true} 
                onDecision={(type) => promptDecision(selectedDispute._id, type)}
            />

            <DecisionModal 
                isOpen={decisionModal.isOpen}
                type={decisionModal.type}
                onClose={() => setDecisionModal({ ...decisionModal, isOpen: false })}
                onSubmit={handleFinalDecision}
            />
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </div>
);

export default AdminDashboard;
