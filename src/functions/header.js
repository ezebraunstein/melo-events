
// import React, { useState, useEffect } from 'react';
// import { useAuth0 } from "@auth0/auth0-react";
// import meloLogo from '../images/MeloLogo.png';
// import ButtonCreateEvent from './ButtonCreateEvent';
// import ButtonReturn from './ButtonReturn';
// import ButtonLogin from './ButtonLogin';
// import ButtonLogout from './ButtonLogout';
// import ButtonOwnerEvents from './ButtonOwnerEvents';
// import checkRRPP from '../functions/checkRRPP';
// import Hamburger from './Hamburguer';
// import '@aws-amplify/ui-react/styles.css';

// const Header = () => {

//   const { isAuthenticated, user } = useAuth0();
//   const [isRRPP, setIsRRPP] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);  // State for the hamburger menu
//   const url = window.location.pathname;

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const checkIfRRPP = async () => {
//         const rrppExists = await checkRRPP(user.sub);
//         setIsRRPP(rrppExists);
//       };
//       checkIfRRPP();
//     }
//   }, [isAuthenticated, user]);

//   const isRRPPEventPage = url === '/mi-evento-rrpp';

//   const renderMenuItems = () => {
//     if (isRRPP) {
//       return (
//         <>
//           {isRRPPEventPage
//             ? <div className="box-1"><button className="btnHeader" onClick={() => window.location.href = '/'}>Volver</button></div>
//             : <div className="box-1"><button className="btnHeader" onClick={() => window.location.href = '/mi-evento-rrpp'}>Mis Eventos</button></div>}
//           {isAuthenticated && <ButtonLogout />}
//         </>
//       );
//     }
//     return (
//       <>
//         {url !== '/crear-usuario' && (isAuthenticated
//           ? (url === '/' ? <ButtonCreateEvent /> : <ButtonReturn />)
//           : <ButtonLogin />)}
//         {url !== '/crear-usuario' && isAuthenticated && <ButtonOwnerEvents />}
//         {isAuthenticated && <ButtonLogout />}
//       </>
//     );
//   }

//   return (
//     <div >
//       <header>
//         {url === '/crear-usuario'
//           ? <a><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
//           : <a href='/'><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
//         }

//         <div className={menuOpen ? 'box-1 show-on-mobile' : 'box-1'}>
//           {renderMenuItems()}
//         </div>

//         {/* Mobile view hamburger */}
//         <div className="mobile-view">
//           <Hamburger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
//         </div>
//       </header>

//       {/* The menu for mobile view */}
//       {menuOpen && (
//         <div className="hamburger-menu">
//           {renderMenuItems()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;




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

const Header = () => {

  const { isAuthenticated, user } = useAuth0();
  const [isRRPP, setIsRRPP] = useState(false);
  const url = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

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

  if (isRRPP) {
    return (
      <header>
        {url === '/crear-usuario' ? (
          <a><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
        ) : (
          <a href='/'><img className="logo" src={meloLogo} alt="melo-logo" width="400px" /></a>
        )}

        <div className='box-1'>
          {isRRPPEventPage && <button className="btnHeader" onClick={() => window.location.href = '/'}>Volver</button>}
          {!isRRPPEventPage && <button className="btnHeader" onClick={() => window.location.href = '/mi-evento-rrpp'}>Mis Eventos</button>}
          {isAuthenticated && <ButtonLogout />}
        </div>
      </header>
    );
  }

  return (
    <header>
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

      <div className='box-1'>
        {url !== '/crear-usuario' && (isAuthenticated ? (url === '/' ? <ButtonCreateEvent /> : <ButtonReturn />) : (<ButtonLogin />))}
        {url !== '/crear-usuario' && isAuthenticated && <ButtonOwnerEvents />}
        {isAuthenticated && <ButtonLogout />}
      </div>
    </header>
  );
};

export default Header;


