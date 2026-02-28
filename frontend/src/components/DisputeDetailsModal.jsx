import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Calendar, User, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Button } from './Ui/Button';

const DisputeDetailsModal = ({ isOpen, onClose, dispute }) => {
    if (!isOpen || !dispute) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
                {/* Header */}
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Dispute Details</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {dispute._id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        dispute.status === 'Open' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' :
                        dispute.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' :
                        'bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                    }`}>
                        <span className="font-bold text-sm uppercase tracking-wider">Current Status</span>
                        <span className="font-black text-lg">{dispute.status}</span>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Issue Type</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" /> {dispute.reason}
                            </span>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Claim Amount</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" /> ₹{dispute.claimAmount}
                            </span>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Against Renter</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" /> {dispute.defendant?.name || "Unknown"}
                            </span>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Rental Date</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" /> 
                                {new Date(dispute.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Description of Issue</h4>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {dispute.description}
                        </div>
                    </div>

                    {/* Proof Images Gallery */}
                    <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Evidence / Proof Photos
                        </h4>
                        {dispute.proofImages?.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {dispute.proofImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative group">
                                        <img 
                                            src={img} 
                                            alt={`Proof ${idx + 1}`} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <a 
                                            href={img} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider"
                                        >
                                            View Full Size
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 text-sm">
                                No images uploaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end">
                    <Button onClick={onClose}>Close Details</Button>
                </div>
            </motion.div>
        </div>
    );
};

export default DisputeDetailsModal;