import { useState, useEffect } from "react";
import { createUser, createRRPP } from "../graphql/mutations";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import awsExports from "../aws-exports";
import Swal from 'sweetalert2';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function App({ user }) {
  const [userData, setUsersData] = useState({});
  const [typeUser, setTypeUser] = useState('producer');
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      userData.nameUser &&
      userData.surnameUser &&
      userData.dniUser
    );
  }, [userData]);

  const handleSubmit = async (event) => {

    event.preventDefault();

    const createUserInput = {
      id: user.username,
      nameUser: userData.nameUser,
      surnameUser: userData.surnameUser,
      dniUser: userData.dniUser,
      emailUser: user.attributes.email
    };

    const createRRPPInput = {
      id: user.username,
      nameRRPP: userData.nameUser,
      surnameRRPP: userData.surnameUser,
      dniRRPP: userData.dniUser,
      emailRRPP: user.attributes.email
    };

    try {
      debugger;
      if (typeUser === 'rrpp') {
        await API.graphql(
          graphqlOperation(createRRPP, { input: createRRPPInput }));
        navigate(`/rrpp-events`);
      } else if (typeUser === 'producer') {
        await API.graphql(
          graphqlOperation(createUser, { input: createUserInput }));
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'dniUser') {
      const regex = /^[0-9]*$/;
      if (!(regex.test(value) || value === "")) {
        return;
      }
    }

    setUsersData({ ...userData, [name]: value.toUpperCase() });
  };

  const handleTypeUserChange = (event) => {
    setTypeUser(event.target.value);
  };

  return (
    <div className="eventClass">
      <form className="eventForm" onSubmit={handleSubmit}>
        <label className="labelCreateUser">Nombre/s:
          <input className="inputCreateUser"
            placeholder="Nombre"
            name="nameUser"
            value={userData.nameUser}
            required
            onChange={handleInputChange}
          ></input>
        </label>
        <label className="labelCreateUser">Apellido/s:
          <input className="inputCreateUser"
            placeholder="Apellido"
            name="surnameUser"
            value={userData.surnameUser}
            required
            onChange={handleInputChange}
          ></input>
        </label>
        <label className="labelCreateUser">DNI:
          <input className="inputCreateUser"
            placeholder="DNI"
            name="dniUser"
            value={userData.dniUser}
            required
            pattern="\d{8}"
            maxLength="8"
            minLength="8"
            inputMode="numeric"
            onChange={handleInputChange}
          ></input>
        </label>
        <label className="labelCreateUser">Tipo de usuario:
          <select className="inputCreateUser"
            name="typeUser"
            value={typeUser}
            onChange={handleTypeUserChange}
          >
            <option value="producer">Productor</option>
            <option value="rrpp">RRPP</option>
          </select>
        </label>
        <br />
        <div style={{ textAlign: 'centered' }}>
          <button className='btnMain' type="submit" disabled={!isFormValid}>
            Agregar Usuario
          </button>
        </div>
        <br />
        <br />
      </form>
    </div>
  );
}

export default withAuthenticator(App);
