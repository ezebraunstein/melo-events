import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div className="circular-progress">
            <CircularProgress />
        </div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
