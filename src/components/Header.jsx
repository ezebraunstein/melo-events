import React from 'react';
import meloLogo from '../images/MeloLogo.png';
import ButtonCreateEvent from './ButtonCreateEvent';
import ButtonReturn from './ButtonReturn';
import ButtonLogin from './ButtonLogin';
import ButtonLogout from './ButtonLogout';
import { useAuth0 } from "@auth0/auth0-react";
import ButtonOwnerEvents from './ButtonOwnerEvents';
import '@aws-amplify/ui-react/styles.css';

const Header = () => {

  const { isAuthenticated } = useAuth0();
  const url = window.location.pathname;

  return (
    <header>
      {/* Si estoy en /create-user, el logo NO puede redireccionarme a la homepage */}
      {url === '/crear-usuario' && (
        <a>
          <img className="logo" src={meloLogo} alt="LA PALA" width="300px" />
        </a>
      )}

      {/* Caso contrario, si */}
      {url !== '/crear-usuario' && (
        <a href='/'>
          <img className="logo" src={meloLogo} alt="LA PALA" width="300px" />
        </a>
      )}

      <div className='box-1'>
        {url !== '/crear-usuario' && (isAuthenticated ? (url === '/' ? <ButtonCreateEvent /> : <ButtonReturn />) : (<ButtonLogin />))}
        {url !== '/crear-usuario' && isAuthenticated && <ButtonOwnerEvents />}
        {isAuthenticated && <ButtonLogout />}
      </div>
    </header>
  );
};

export default Header;


