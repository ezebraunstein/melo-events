import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import checkUser from './checkUser'
import checkRRPP from './checkRRPP';
import CircularProgress from '@mui/material/CircularProgress';
import '@aws-amplify/ui-react/styles.css';

const Login = () => {

    const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (isLoading) {
            return <div className="circular-progress">
                <CircularProgress />
            </div>
        }

        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }

        if (isAuthenticated && user) {
            const checkData = async () => {
                const [userExistsResult, RRPPExistsResult] = await Promise.all([
                    checkUser(user.sub),
                    checkRRPP(user.sub),
                ]);

                if (userExistsResult === true) {
                    navigate(`/`);
                    console.log("User Existe");
                } else if (RRPPExistsResult === true) {
                    navigate(`/`);
                    console.log("RRPP Existe");
                } else {
                    navigate(`/crear-usuario`);
                    console.log("No existe");
                }
                setLoading(false);
            };
            checkData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user, navigate]);

    if (loading) {
        return (
            <div className="circular-progress">
                <CircularProgress />
            </div>
        );
    }

    return null;
};

export default Login;



