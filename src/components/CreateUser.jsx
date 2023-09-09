import { useState, useEffect } from "react";
import { createUser, createRRPP } from "../graphql/mutations";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import awsExports from "../aws-exports";
import { useAuth0 } from "@auth0/auth0-react";

Amplify.configure(awsExports);

function App() {

  const [userData, setUsersData] = useState({});
  const [typeUser, setTypeUser] = useState("");
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const { user } = useAuth0();

  useEffect(() => {
    setIsFormValid(
      userData.nameUser &&
      userData.surnameUser &&
      userData.dniUser
    );
  }, [userData]);

  const getInputData = () => {
    const baseData = {
      id: user.sub,
    };

    if (typeUser === 'rrpp') {
      return {
        ...baseData,
        nameRRPP: userData.nameUser,
        surnameRRPP: userData.surnameUser,
        dniRRPP: userData.dniUser,
        emailRRPP: user.email
      };
    } else {
      return {
        ...baseData,
        nameUser: userData.nameUser,
        surnameUser: userData.surnameUser,
        dniUser: userData.dniUser,
        emailUser: user.email
      };
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    const inputData = getInputData();

    let path = '/';
    let operation = createUser;
    if (typeUser === 'rrpp') {
      path = '/mi-evento-rrpp';
      operation = createRRPP;
    }

    try {
      await API.graphql(graphqlOperation(operation, { input: inputData }));
      navigate(path);
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'dniUser' && !/^[0-9]*$/.test(value) && value !== "") {
      return;
    }
    setUsersData({ ...userData, [name]: value.toUpperCase() });
  };

  const handleTypeUserChange = (event) => {
    setTypeUser(event.target.value);
  };

  return (
    <div className="event-class">
      <div className="create-user-container">
        <form onSubmit={handleSubmit}>
          <input className="event-input"
            placeholder="NOMBRE*"
            name="nameUser"
            value={userData.nameUser}
            required
            onChange={handleInputChange}
          ></input>
          <input className="event-input"
            placeholder="APELLIDO*"
            name="surnameUser"
            value={userData.surnameUser}
            required
            onChange={handleInputChange}
          ></input>
          <input className="event-input"
            placeholder="DNI*"
            name="dniUser"
            value={userData.dniUser}
            required
            pattern="\d{8}"
            maxLength="8"
            minLength="8"
            inputMode="numeric"
            onChange={handleInputChange}
          ></input>
          <select className="event-input"
            name="typeUser"
            value={typeUser}
            onChange={handleTypeUserChange}
          >
            <option value="" disabled selected hidden>TIPO USUARIO*</option>
            <option value="producer">PRODUCTOR</option>
            <option value="rrpp">RRPP</option>
          </select>
          <br />
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
    </div>
  );
}

export default App;
