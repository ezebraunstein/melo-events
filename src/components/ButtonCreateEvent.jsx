import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonCreateEvent = () => {

  const navigate = useNavigate();

  function onclick() {
    navigate(`/create-event`);
  };

  return (
    <div className="box-1">
      <button className="btnHeader" onClick={onclick}>
        <span>Crear Evento</span>
      </button>
    </div>
  );
};


export default ButtonCreateEvent;

