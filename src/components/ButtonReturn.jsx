import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonReturn = () => {

  const navigate = useNavigate();

  function onclick() {
    navigate(`/`);
  };

  return (
    <div className="box-1">
      <button className="btnHeader" onClick={onclick}>
        <span>Volver</span>
      </button>
    </div>
  );
};

export default ButtonReturn;

