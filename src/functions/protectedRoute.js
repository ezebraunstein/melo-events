import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) {
        return (
            <div className="circular-progress">
                <CircularProgress />
            </div>
        );
    }

    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }

    return children;
};

export default ProtectedRoute;
