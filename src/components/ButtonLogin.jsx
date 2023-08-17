import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonLogin = () => {

  const navigate = useNavigate();

  function onclick() {
    navigate('/login');
  };

  return (
    <div className="box-1">
      <button className="btnHeader" onClick={onclick}>
        <span>Iniciar Sesión</span>
      </button>
    </div>
  );
};

export default ButtonLogin;
