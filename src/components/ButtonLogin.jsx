import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { isMobile } from 'react-device-detect';

const ButtonLogin = () => {

  const { loginWithRedirect } = useAuth0();

  if (isMobile) {
    return (
      <div className="box-1">
        <button className="btnHeader" onClick={() => loginWithRedirect()}>
          <span>Iniciar Sesión</span>
        </button>
      </div>
    );
  }
  return (
    <div className="box-1" style={{ paddingRight: '50px' }}>
      <button className="btnHeader" onClick={() => loginWithRedirect()}>
        <span>Iniciar Sesión</span>
      </button>
    </div>
  );
};

export default ButtonLogin;
