import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen pt-28 flex justify-center">Loading...</div>;
    }

    if (!user || !user.roles?.admin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
