import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
            <CircularProgress />
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
