import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { Button } from '../components/Ui/Button';
import { useAuth } from '../Context/AuthContext'; // Import to update user state

const UploadID = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // We will use this to update the user context manually if needed
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        setLoading(true);
        const formData = new FormData();
        formData.append("identityProof", file);

        try {
            await api.post('/users/upload-id', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("ID Uploaded! You can now rent items.");
            // Force reload to update User Context with new ID data
            window.location.href = '/'; 
        } catch (error) {
            alert("Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 px-4 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 h-fit">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">One-Time Verification</h1>
                    <p className="text-slate-500 mt-2">Upload your Govt ID once. We'll show it to lenders only when you request an item.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition">
                        <input 
                            type="file" 
                            onChange={(e) => setFile(e.target.files[0])} 
                            className="hidden" 
                            id="id-upload"
                            accept="image/*,.pdf"
                        />
                        <label htmlFor="id-upload" className="cursor-pointer block">
                            {file ? (
                                <div className="text-green-600 font-bold flex flex-col items-center">
                                    <CheckCircle className="mb-2" />
                                    {file.name}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-500">
                                    <Upload className="mb-2" />
                                    <span>Click to Upload ID</span>
                                </div>
                            )}
                        </label>
                    </div>
                    <Button type="submit" className="w-full" isLoading={loading}>Save & Continue</Button>
                </form>
            </div>
        </div>
    );
};

export default UploadID;