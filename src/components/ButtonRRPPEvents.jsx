import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonRRPPEvents = () => {

  const navigate = useNavigate();

  function onclick() {
    navigate('/mis-eventos-rrpp');
  };

  return (
    <div className="box-1">
      <button className="btnHeader" onClick={onclick}>
        <span>Mis Eventos RRPP</span>
      </button>
    </div>
  );
};

export default ButtonRRPPEvents;