import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../graphql/queries";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import CircularProgress from '@mui/material/CircularProgress';
import '@aws-amplify/ui-react/styles.css';

const OwnerEvents = ({ user }) => {

  //CLOUDFRONT URL

  const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const eventsData = await API.graphql(graphqlOperation(listEvents));
      const eventsList = eventsData.data.listEvents.items;
      const filterEventsList = eventsList.filter(
        (event) => event.userID === user.username
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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
      <CircularProgress />
    </div>
  }

  return (
    <div id="boxes">
      <h1 className="eventBoxTitle">Mis Eventos</h1>
      <div className="eventBoxContainer">
        {events.map((event) => (
          <div key={event.id} className="eventBox">
            <img className="imgEventBox" src={event.imageUrl} alt={event.nameEvent} />
            <h3 className="nameEventBox">{event.nameEvent}</h3>
            <button onClick={() => handleButtonClick(event)} className="eventBoxBtnBuy">
              <i className="icon-ticket"></i>Acceder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default withAuthenticator(OwnerEvents);
