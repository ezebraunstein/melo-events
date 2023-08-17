import React, { useEffect, useState } from 'react';
import meloLogo from '../images/MeloLogo.png';
import ButtonLogout from './ButtonLogout';
import { Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

const HeaderRRPP = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };

    updateUser();

    const listener = (data) => {
      switch (data.payload.event) {
        case 'signIn':
        case 'signUp':
          updateUser();
          break;
        case 'signOut':
          setUser(null);
          break;
        default:
          break;
      }
    };

    Hub.listen('auth', listener);

  }, []);

  const url = window.location.pathname;

  const isRRPPEventPage = url.startsWith("/rrpp-events") && url !== "/rrpp-events";

  return (
    <header>

      {/* Si estoy en /create-user, el logo NO puede redireccionarme a la homepage */}

      {url === '/create-user' && (
        <a>
          <img className="logo" src={meloLogo} alt="LA PALA" width="400px" />
        </a>)}

      {/* Caso contrario, si */}

      {url !== '/create-user' && (
        <a>
          <img className="logo" src={meloLogo} alt="LA PALA" width="400px" />
        </a>)}

      <div className='box-1'>
        {isRRPPEventPage && <button className="btnHeader" onClick={() => window.location.href = '/rrpp-events'}>Volver</button>}
        {user && <ButtonLogout />}
      </div>
    </header>
  );
};

export default HeaderRRPP;



