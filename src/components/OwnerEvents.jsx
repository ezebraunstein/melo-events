import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';
import fetchEvents from "../functions/fetchEvents";
import '@aws-amplify/ui-react/styles.css';

const OwnerEvents = () => {

  //PARAMS
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const fetchedEvents = await fetchEvents(user.sub);
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    })();
  }, [user.sub]);

  function handleButtonClick(event) {
    navigate(`/mi-evento/${event.id}`);
  }

  function onclick() {
    navigate(`/crear-evento`);
  };

  if (loading) {
    return <div className="circular-progress">
      <CircularProgress />
    </div>
  }

  return (
    <div className="eventClass">
      {events.length > 0 ? (
        <div id="boxes">
          <h1 className="eventBoxTitle">Mis Eventos</h1>
          <div className="eventBoxContainer">
            {events.map((event) => (
              <div key={event.id} className="eventBox">
                <img className="imgEventBox" src={event.imageUrl} alt={event.nameEvent} />
                <h3 className="nameEventBox">{event.nameEvent}</h3>
                <button onClick={() => handleButtonClick(event)} className="eventBoxBtnBuy">
                  Acceder
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="containerMessage">
          <div>
            <h1 className="titleMessage">Todavía no hay eventos creados</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btnMain" onClick={onclick}>
              Crear nuevo Evento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerEvents;
