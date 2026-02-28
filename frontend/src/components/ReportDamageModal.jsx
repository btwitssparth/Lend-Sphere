import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { createDispute } from '../api/dispute';
import { Button } from './Ui/Button';

const ReportDamageModal = ({ isOpen, onClose, rental, onSuccess }) => {
    const [reason, setReason] = useState("Damage");
    const [description, setDescription] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen || !rental) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("rentalId", rental._id);
        formData.append("reason", reason);
        formData.append("description", description);
        formData.append("claimAmount", claimAmount);
        
        for (let i = 0; i < files.length; i++) {
            formData.append("proofImages", files[i]);
        }

        try {
            await createDispute(formData);
            alert("Dispute raised successfully. Our team will review it.");
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to raise dispute");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-bold">Report Issue</h3>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-zinc-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Issue Type</label>
                        <select 
                            value={reason} onChange={e => setReason(e.target.value)}
                            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none"
                        >
                            <option value="Damage">Item Damaged</option>
                            <option value="Item Missing">Item Missing / Not Returned</option>
                            <option value="Late Return">Late Return Fee</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Claim Amount (₹)</label>
                        <input 
                            type="number" required min="0"
                            value={claimAmount} onChange={e => setClaimAmount(e.target.value)}
                            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none"
                            placeholder="e.g. 2000"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Description</label>
                        <textarea 
                            required rows="3"
                            value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none resize-none"
                            placeholder="Describe the damage or issue..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Proof Photos</label>
                        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors relative">
                            <input 
                                type="file" multiple accept="image/*" required
                                onChange={e => setFiles(e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
                            <p className="text-sm text-zinc-500">{files.length > 0 ? `${files.length} files selected` : "Click to upload proof"}</p>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="danger" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Claim"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ReportDamageModal;