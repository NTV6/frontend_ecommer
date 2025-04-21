import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function AdminRoute({ children }) {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;