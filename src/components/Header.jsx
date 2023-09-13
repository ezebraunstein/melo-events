import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import meloLogo from '../images/MeloLogo.png';
import ButtonCreateEvent from './ButtonCreateEvent';
import ButtonReturn from './ButtonReturn';
import ButtonLogin from './ButtonLogin';
import ButtonLogout from './ButtonLogout';
import ButtonOwnerEvents from './ButtonOwnerEvents';
import ButtonRRPPEvents from './ButtonRRPPEvents';
import checkRRPP from '../functions/checkRRPP';
import '@aws-amplify/ui-react/styles.css';

const Header = () => {

  const { isAuthenticated, user } = useAuth0();
  const [isRRPP, setIsRRPP] = useState(false);
  const url = window.location.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkIfRRPP = async () => {
        const rrppExists = await checkRRPP(user.sub);
        setIsRRPP(rrppExists);
      };
      checkIfRRPP();
    }
  }, [isAuthenticated, user]);

  if (isRRPP) {
    return (
      <header>

        {url === '/crear-usuario' ? (
          <a><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
        ) : (
          <a href='/'><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
        )}

        <div className='box-1'>
          {isAuthenticated && isRRPP && (
            <>
              {url === '/' && <ButtonRRPPEvents />}
              {url === '/mis-eventos-rrpp' && <ButtonReturn />}
              {(url === '/mi-evento-rrpp' || url.includes('/mi-evento-rrpp/')) && <ButtonReturn />}
              <ButtonLogout />
            </>
          )}
          {url !== '/crear-usuario' && !isAuthenticated && <ButtonLogin />}
        </div>
      </header>
    );
  }

  return (
    <header>

      {url === '/crear-usuario' ? (
        <a><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
      ) : (
        <a href='/'><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
      )}

      <div className='box-1'>
        {isAuthenticated && (
          <>
            {url === '/' && <ButtonOwnerEvents />}

            {(url === '/mis-eventos' || url.includes('/mis-eventos/')) && (
              <>
                <ButtonReturn />
                {url === '/mis-eventos' && <ButtonCreateEvent />}
              </>
            )}

            {(url === '/mi-evento' || url.includes('/mi-evento/')) && <ButtonReturn />}

            {(url === '/editar-evento' || url.includes('/editar-evento/')) && <ButtonReturn />}

            {(url === '/comprar-tickets' || url.includes('/comprar-tickets/')) && <ButtonReturn />}

            {url === '/crear-evento' && <ButtonReturn />}

            <ButtonLogout />
          </>
        )}
        {url !== '/crear-usuario' && !isAuthenticated && <ButtonLogin />}
      </div>

    </header>
  );
};

export default Header;


