import React from 'react';
import meloLogo from '../images/MeloLogo.png';
import ButtonLogout from './ButtonLogout';
import { useAuth0 } from "@auth0/auth0-react";
import '@aws-amplify/ui-react/styles.css';

const HeaderRRPP = () => {
  const { isAuthenticated } = useAuth0();
  const url = window.location.pathname;
  const isRRPPEventPage = url.startsWith("/rrpp-events") && url !== "/rrpp-events";
  return (
    <header>
      {/* Si estoy en /create-user, el logo NO puede redireccionarme a la homepage */}
      {url === '/create-user' && (
        <a>
          <img className="logo" src={meloLogo} alt="LA PALA" width="400px" />
        </a>
      )}

      {/* Caso contrario, si */}
      {url !== '/create-user' && (
        <a href='/'>
          <img className="logo" src={meloLogo} alt="LA PALA" width="400px" />
        </a>
      )}

      <div className='box-1'>
        {isRRPPEventPage && <button className="btnHeader" onClick={() => window.location.href = '/rrpp-events'}>Volver</button>}
        {isAuthenticated && <ButtonLogout />}
      </div>
    </header>
  );
};

export default HeaderRRPP;



