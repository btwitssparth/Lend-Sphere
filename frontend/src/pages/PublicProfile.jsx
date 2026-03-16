import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api/users'; // 🔥 Imported updateUserProfile
import { useAuth } from '../Context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, AlertTriangle, Calendar, Star, 
    MapPin, Package, ArrowLeft, MessageSquare, Info, Edit, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Ui/Button';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); // We might need setUser to update global context name
    
    const [profile, setProfile] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 🔥 Modal & Edit States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', bio: '' });
    const [isSaving, setIsSaving] = useState(false);

    const isOwnProfile = user && user._id === id;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await getUserProfile(id);
                const responseData = response.data.data; 
                
                setProfile(responseData.profile);
                setUserItems(responseData.products || []);
                setStats(responseData.stats || { totalReviews: 0, averageRating: 0 });
                
                // Pre-fill edit form
                setEditFormData({
                    name: responseData.profile.name || '',
                    bio: responseData.profile.bio || ''
                });

                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'User not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfileData();
    }, [id]);

    // 🔥 Handle Profile Update Submission
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await updateUserProfile({
                name: editFormData.name,
                bio: editFormData.bio
            });
            
            // Update local state instantly
            setProfile(prev => ({ ...prev, name: editFormData.name, bio: editFormData.bio }));
            
            // Update Context if you store name there (optional, depends on your AuthContext)
            if (setUser && user) {
                setUser({ ...user, name: editFormData.name });
            }

            setIsEditModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const getTrustScoreColor = (score) => {
        if (!score) return "text-zinc-500 bg-zinc-100 dark:bg-zinc-800";
        if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
        if (score >= 50) return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800";
        return "text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-zinc-50 dark:bg-zinc-950 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4">
                <AlertTriangle className="w-16 h-16 text-zinc-400 mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Profile Not Found</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error || "This user doesn't exist or was removed."}</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const isVerified = profile?.identityProof || profile?.hasUploadedID || false;
    const calculatedTrustScore = stats.averageRating > 0 ? Math.round(stats.averageRating * 20) : 0; 
    const userName = profile?.name || 'User';
    const initial = userName.charAt(0).toUpperCase();
    const firstName = userName.split(' ')[0];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors mb-6 outline-none"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start mb-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20 z-0"></div>

                    <div className="relative z-10 shrink-0">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-zinc-300 dark:text-zinc-600">
                                    {initial}
                                </span>
                            )}
                        </div>
                        {isVerified && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full border-2 border-white dark:border-zinc-900 shadow-lg" title="Identity Verified">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 z-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                                    {userName} {isOwnProfile && <span className="text-sm font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full ml-2">You</span>}
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1 flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4" /> Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                </p>
                            </div>
                            
                            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 shadow-sm ${getTrustScoreColor(calculatedTrustScore)}`}>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Trust Score</p>
                                    <p className="text-xl font-black leading-none">{calculatedTrustScore > 0 ? `${calculatedTrustScore}/100` : 'New User'}</p>
                                </div>
                                {calculatedTrustScore >= 80 && <Star className="w-6 h-6 fill-current" />}
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Info className="w-3 h-3" /> About {isOwnProfile ? "You" : "User"}
                                </h3>
                                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {profile.bio || (isOwnProfile ? "You haven't added a bio yet. Click Edit Profile to add one!" : "This user hasn't added a bio yet.")}
                                </p>
                            </div>
                            <div className="flex-shrink-0 sm:border-l sm:border-zinc-200 dark:sm:border-zinc-700 sm:pl-6 flex flex-col justify-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="font-bold text-zinc-900 dark:text-white">{stats.averageRating || "N/A"}</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{stats.totalReviews} Reviews</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!isOwnProfile ? (
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                    <MessageSquare className="w-4 h-4" /> Message
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setIsEditModalOpen(true)} // 🔥 Opens Modal
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm outline-none focus:outline-none"
                                >
                                    <Edit className="w-4 h-4" /> Edit Profile
                                </button>
                            )}

                            {isVerified && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-xl text-sm font-bold">
                                    <ShieldCheck className="w-4 h-4" /> ID Verified
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Listings Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                Listings by {isOwnProfile ? "You" : firstName}
                            </h2>
                        </div>
                        <span className="text-sm font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">{userItems.length} items</span>
                    </div>

                    {userItems.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
                            <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                                {isOwnProfile ? "You haven't listed any items yet." : "This user doesn't have any active listings right now."}
                            </p>
                            {isOwnProfile && (
                                <Link to="/add-product" className="inline-block mt-4 text-blue-600 font-bold hover:underline">
                                    List your first item
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userItems.map((product) => (
                                <Link 
                                    key={product._id}
                                    to={`/product/${product._id}`} 
                                    className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 h-full"
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        <img 
                                            src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-black text-zinc-900 dark:text-zinc-50 shadow-md">
                                            ₹{product.pricePerDay} <span className="text-xs text-zinc-500 font-semibold">/day</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 truncate mb-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                                            <div className="flex items-center text-xs font-medium text-zinc-500">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                <span className="truncate">{product.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* 🔥 Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Edit Profile</h3>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                        Display Name
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                        Bio / About Me
                                    </label>
                                    <textarea 
                                        rows="4"
                                        value={editFormData.bio}
                                        onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        placeholder="Tell people a bit about yourself..."
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => setIsEditModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="flex-1"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicProfile;