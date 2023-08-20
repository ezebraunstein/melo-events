import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../graphql/queries";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

import '@aws-amplify/ui-react/styles.css';

const OwnerEvents = () => {

  //CLOUDFRONT URL
  const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

  //PARAMS
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth0();

  const fetchEvents = async () => {
    try {
      const eventsData = await API.graphql(graphqlOperation(listEvents));
      const eventsList = eventsData.data.listEvents.items;
      const filterEventsList = eventsList.filter(
        (event) => event.userID === user.sub
      );
      const eventsWithImages = await Promise.all(
        filterEventsList.map(async (event) => {
          const imagePath = `${event.flyerMiniEvent}`;
          const imageUrl = `${cloudFrontUrl}/${imagePath}`;
          event.imageUrl = imageUrl;
          return event;
        })
      );
      setEvents(eventsWithImages);
      setLoading(false);
    } catch (error) {
      console.log("", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleButtonClick(event) {
    navigate(`/events/${event.id}`);
  }

  function onclick() {
    navigate(`/create-event`);
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
