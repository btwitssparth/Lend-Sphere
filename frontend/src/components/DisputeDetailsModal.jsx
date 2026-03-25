import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, AlertTriangle, Calendar, User, IndianRupee, Image as ImageIcon, 
    CheckCircle, XCircle, MessageSquare, Gavel, Scale, ExternalLink 
} from 'lucide-react';
import { Button } from './Ui/Button';
import { submitDisputeResponse } from '../api/dispute';

const DisputeDetailsModal = ({ isOpen, onClose, dispute, isRenterView, isAdmin, onDecision, onResponseSuccess }) => {
    const [responseComment, setResponseComment] = useState("");
    const [responseFiles, setResponseFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && dispute) {
            console.log("--- MODAL DEBUG ---");
            console.log("Dispute Data:", dispute);
            console.log("Lender Images:", dispute.proofImages);
            console.log("Renter Images:", dispute.defendantProof);
            console.log("Is Admin?", isAdmin);
            console.log("Is Renter?", isRenterView);
            console.log("Status:", dispute.status);
            console.log("-------------------");
        }
    }, [isOpen, dispute, isAdmin, isRenterView]);

    if (!isOpen || !dispute) return null;

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        formData.append('comment', responseComment);
        
        // Add optional proof images
        for (let i = 0; i < responseFiles.length; i++) {
            formData.append('proofImages', responseFiles[i]);
        }
        
        try {
            await submitDisputeResponse(dispute._id, formData);
            alert("Response submitted successfully!");
            if (onResponseSuccess) onResponseSuccess();
            onClose();
        } catch (error) {
            console.error("Submit response error:", error);
            alert(error.response?.data?.message || "Failed to submit response");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
                {/* Header */}
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Dispute Evidence File</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Case ID: {dispute._id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    
                    {/* Status Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Status</span>
                            <span className={`text-sm font-black uppercase ${
                                dispute.status === 'Open' ? 'text-blue-600' :
                                dispute.status === 'Resolved' ? 'text-green-600' :
                                dispute.status === 'Rejected' ? 'text-red-600' : 'text-orange-500'
                            }`}>{dispute.status}</span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Claim Amount</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-1">
                                <IndianRupee className="w-4 h-4 text-green-500" /> {dispute.claimAmount}
                            </span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Reason</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" /> {dispute.reason}
                            </span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Parties</span>
                            <div className="flex flex-col text-xs">
                                <span className="text-zinc-900 dark:text-zinc-100 font-medium">By: {dispute.raiser?.name}</span>
                                <span className="text-zinc-500">Vs: {dispute.defendant?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* LENDER'S CLAIM */}
                    <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-2 mb-3 border-b border-red-200 dark:border-red-900/50 pb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <h4 className="font-bold text-red-900 dark:text-red-100 text-sm uppercase tracking-wider">Lender's Claim</h4>
                        </div>
                        
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                            {dispute.description}
                        </p>
                        
                        {/* 🔥 FIXED IMAGE SECTION */}
                        <div className="mt-4">
                            <span className="text-xs font-bold text-red-800 dark:text-red-300 mb-2 block flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> Evidence Photos
                            </span>
                            
                            {dispute.proofImages && Array.isArray(dispute.proofImages) && dispute.proofImages.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {dispute.proofImages.map((img, i) => (
                                        <a 
                                            key={i} 
                                            href={img} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="block relative group"
                                        >
                                            <img 
                                                src={img} 
                                                className="w-32 h-32 rounded-lg object-cover border border-red-200 dark:border-red-900/50 shadow-sm hover:scale-105 transition-transform" 
                                                alt={`Proof ${i + 1}`}
                                                onError={(e) => {
                                                    console.error(`Image failed to load: ${img}`);
                                                    e.target.src = '/default-placeholder.png';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                                <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed border-red-300 rounded-lg text-red-500 text-xs italic bg-red-50/50">
                                    No evidence photos uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RENTER'S DEFENSE */}
                    {(dispute.isResponseSubmitted || (isRenterView && dispute.status === 'Open')) && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center gap-2 mb-3 border-b border-blue-200 dark:border-blue-900/50 pb-2">
                                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm uppercase tracking-wider">Renter's Defense</h4>
                            </div>

                            {dispute.isResponseSubmitted ? (
                                <>
                                    <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                                        {dispute.defendantComment}
                                    </p>
                                    {dispute.defendantProof && Array.isArray(dispute.defendantProof) && dispute.defendantProof.length > 0 && (
                                         <div className="flex flex-wrap gap-3 mt-4">
                                            {dispute.defendantProof.map((img, i) => (
                                                <a 
                                                    key={i} 
                                                    href={img} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="block"
                                                >
                                                    <img 
                                                        src={img} 
                                                        className="w-32 h-32 rounded-lg object-cover border border-blue-200" 
                                                        alt={`Defense ${i + 1}`}
                                                        onError={(e) => {
                                                            console.error(`Defense image failed: ${img}`);
                                                            e.target.src = '/default-placeholder.png';
                                                        }}
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                isRenterView && dispute.status === 'Open' && (
                                    <form onSubmit={handleSubmitResponse}>
                                        <textarea 
                                            required
                                            className="w-full p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 mb-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            rows="4"
                                            placeholder="Explain your side of the story..."
                                            value={responseComment}
                                            onChange={e => setResponseComment(e.target.value)}
                                        />
                                        
                                        <div className="mb-3">
                                            <label className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 block">
                                                Optional: Upload Counter Evidence
                                            </label>
                                            <input 
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => setResponseFiles(Array.from(e.target.files))}
                                                className="text-sm"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <Button 
                                                type="submit" 
                                                disabled={loading} 
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {loading ? "Submitting..." : "Submit Defense Statement"}
                                            </Button>
                                        </div>
                                    </form>
                                )
                            )}
                        </div>
                    )}

                    {/* ADMIN VERDICT DISPLAY */}
                    {dispute.status !== 'Open' && dispute.status !== 'Under Review' && (
                        <div className={`p-5 rounded-xl border ${
                            dispute.status === 'Resolved' 
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        }`}>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/5">
                                <Gavel className={`w-4 h-4 ${dispute.status === 'Resolved' ? 'text-green-600' : 'text-red-600'}`} />
                                <h4 className={`font-bold text-sm uppercase tracking-wider ${
                                    dispute.status === 'Resolved' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                                }`}>
                                    Official Verdict: {dispute.status === 'Resolved' ? 'Approved' : 'Rejected'}
                                </h4>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
                                "{dispute.adminComment}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    
                    {isAdmin && (dispute.status === 'Open' || dispute.status === 'Under Review') && (
                        <>
                            <Button 
                                className="bg-green-600 hover:bg-green-700 text-white border-none" 
                                onClick={() => onDecision('Resolved')}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve Claim
                            </Button>
                            <Button 
                                variant="danger"
                                onClick={() => onDecision('Rejected')}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Reject Claim
                            </Button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DisputeDetailsModal;