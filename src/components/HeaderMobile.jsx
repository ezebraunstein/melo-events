
import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import meloLogo from '../images/MeloLogo.png';
import ButtonCreateEvent from './ButtonCreateEvent';
import ButtonReturn from './ButtonReturn';
import ButtonLogin from './ButtonLogin';
import ButtonLogout from './ButtonLogout';
import ButtonOwnerEvents from './ButtonOwnerEvents';
import checkRRPP from '../functions/checkRRPP';
import Hamburger from './Hamburguer';
import '@aws-amplify/ui-react/styles.css';

const HeaderMobile = () => {

  const { isAuthenticated, user } = useAuth0();
  const [isRRPP, setIsRRPP] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isRRPPEventPage = url === '/mi-evento-rrpp';

  const renderMenuItems = () => {
    if (isRRPP) {
      return (
        <>
          {/* {isRRPPEventPage && <div className='box-1'><button className="btnHeader" onClick={() => window.location.href = '/'}>Volver</button></div>} */}
          {!isRRPPEventPage && <div className='box-1'><button className="btnHeader" onClick={() => window.location.href = '/mi-evento-rrpp'}>Mis Eventos</button></div>}
          {isAuthenticated && <ButtonLogout />}
        </>
      );
    }
    return (
      <>
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
      </>
    );
  }

  return (
    <div >
      <header>
        {!isAuthenticated && (
          <a href='/'>
            <img className="logo" src={meloLogo} alt="melo-logo" width="400px" />
          </a>
        )}
        {isAuthenticated && isRRPP && (
          <>
            {url === '/crear-usuario' ? (
              <a><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
            ) : (
              <a href='/mi-evento-rrpp'><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
            )}
          </>
        )}
        {isAuthenticated && !isRRPP && (
          <>
            {url === '/crear-usuario' && (
              <a>
                <img className="logo" src={meloLogo} alt="melo-logo" width="400px" />
              </a>
            )}

            {url !== '/crear-usuario' && (
              <a href='/'>
                <img className="logo" src={meloLogo} alt="melo-logo" width="400px" />
              </a>
            )}
          </>
        )}

        {/* Mobile view hamburger */}
        <div className="mobile-view">
          <Hamburger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </header>

      {/* The menu for mobile view */}
      {menuOpen && (
        <div className="hamburger-menu">
          {renderMenuItems()}
        </div>
      )}
    </div>
  );
};

export default HeaderMobile;