import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ButtonLogin = () => {

  const { loginWithRedirect } = useAuth0();

  return (
    // <div className="box-1" style={{ paddingRight: '50px' }}>
    <div className="box-1">
      <button className="btnHeader" onClick={() => loginWithRedirect()}>
        <span>Iniciar Sesión</span>
      </button>
    </div>
  );
};

export default ButtonLogin;
