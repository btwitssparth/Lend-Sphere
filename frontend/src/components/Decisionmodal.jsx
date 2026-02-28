import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Ui/Button';

const DecisionModal = ({ isOpen, onClose, type, onSubmit, loading }) => {
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    const isResolve = type === 'Resolved';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(comment);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center ${
                    isResolve 
                        ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/50' 
                        : 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50'
                }`}>
                    <div className="flex items-center gap-2">
                        {isResolve ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <h3 className={`font-bold ${isResolve ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {isResolve ? 'Approve Dispute' : 'Reject Dispute'}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Consequence Warning Box */}
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-300">
                        <p className="font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Effect of this action:
                        </p>
                        {isResolve ? (
                            <ul className="list-disc list-inside space-y-1.5 ml-1">
                                <li>Status becomes <span className="font-bold text-green-600 dark:text-green-400">Resolved</span>.</li>
                                <li>System will <span className="font-bold text-red-600 dark:text-red-400">DEDUCT 10 Trust Points</span> from the Renter.</li>
                                <li>This marks the Renter as "High Risk".</li>
                            </ul>
                        ) : (
                            <ul className="list-disc list-inside space-y-1.5 ml-1">
                                <li>Status becomes <span className="font-bold text-red-600 dark:text-red-400">Rejected</span>.</li>
                                <li>System will <span className="font-bold text-amber-600 dark:text-amber-500">DEDUCT 2 Trust Points</span> from the Lender (for invalid claim).</li>
                                <li>Dispute is closed with no further action.</li>
                            </ul>
                        )}
                    </div>

                    {/* Admin Reason Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">
                            Admin Decision Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            required
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                            placeholder={isResolve 
                                ? "e.g., 'Photo evidence confirms significant damage. Refund approved.'" 
                                : "e.g., 'Insufficient proof provided. Damage appears to be pre-existing.'"
                            }
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="dark:border-zinc-700 dark:text-zinc-300"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className={`min-w-[140px] border-none text-white shadow-lg transition-transform active:scale-95 ${
                                isResolve 
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' 
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                isResolve ? 'Confirm Approval' : 'Confirm Rejection'
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default DecisionModal;