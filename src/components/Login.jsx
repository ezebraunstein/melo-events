import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import checkUser from './CheckUser';
import checkRRPP from './CheckRRPP';
import '@aws-amplify/ui-react/styles.css';

const Login = ({ user }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const checkData = async () => {
                const [userExistsResult, RRPPExistsResult] = await Promise.all([
                    checkUser(user),
                    checkRRPP(user),
                ]);
                debugger;
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

            };

            checkData();
        }
    }, [user, navigate]);

    return null;
};

export default withAuthenticator(Login);


