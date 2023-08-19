import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import checkUser from '../functions/CheckUser'
import checkRRPP from '../functions/CheckRRPP';
import CircularProgress from '@mui/material/CircularProgress';
import '@aws-amplify/ui-react/styles.css';

const Login = () => {

    const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (isLoading) {
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
                <CircularProgress />
            </div>;
        }

        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }

        if (isAuthenticated && user) {
            const checkData = async () => {
                const userCreado = user.sub;
                console.log("Checking user with ID:", userCreado);

                const [userExistsResult, RRPPExistsResult] = await Promise.all([
                    checkUser(user.sub),
                    checkRRPP(user.sub),
                ]);

                if (userExistsResult === true) {
                    navigate(`/`);
                    console.log("User Existe");
                } else if (RRPPExistsResult === true) {
                    navigate(`/rrpp-events`);
                    console.log("RRPP Existe");
                } else {
                    navigate(`/create-user`);
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
                <CircularProgress />
            </div>
        );
    }

    return null;
};

export default Login;



