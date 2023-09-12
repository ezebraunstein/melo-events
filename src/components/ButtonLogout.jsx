import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

const ButtonLogout = ({ onSignOut }) => {

  const { logout } = useAuth0();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout({ returnTo: window.location.origin });
    navigate(`/`);
    if (onSignOut) {
      onSignOut();
    }
  };

  if (isMobile) {
    return (
      <div className="box-1">
        <button className="btnHeader" onClick={handleSignOut}>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    );
  }
  return (
    <div className="box-1" style={{ paddingRight: '50px' }}>
      <button className="btnHeader" onClick={handleSignOut}>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default ButtonLogout;

