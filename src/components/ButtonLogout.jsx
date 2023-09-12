import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    // <div className="box-1" style={{ paddingRight: '50px' }}>
    <div className="box-1">
      <button className="btnHeader" onClick={handleSignOut}>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default ButtonLogout;

