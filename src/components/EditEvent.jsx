import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { getEvent } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { listTypeTickets } from '../graphql/queries';
import CreateTypeTicket from './CreateTypeTicket';
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import ButtonTypeTicket from './ButtonTypeTicket';
import CircularProgress from '@mui/material/CircularProgress';

const EditEvent = () => {

  //CLOUDFRONT URL

  const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';


  //PARAMS
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [typeTickets, setTypeTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  //API GOOGLE MAPS
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);


  const [isActiveLocal, setIsActiveLocal] = useState(false);
  const toggleActive = () => {
    setIsActiveLocal(!isActiveLocal);
  };


  useEffect(() => {
    setMapsApiLoaded(true);
  }, []);

  useEffect(() => {
    if (eventData && eventData.locationEvent) {
      const locationEvent = JSON.parse(eventData.locationEvent);
      setSelectedLocation(locationEvent);
    }
  }, [eventData]);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    debugger;
    try {
      const eventResult = await API.graphql(
        graphqlOperation(getEvent, { id: eventId })
      );
      const event = eventResult.data.getEvent;
      const imagePath = `${event.flyerMiniEvent}`;
      const imageUrl = `${cloudFrontUrl}/${imagePath}`;
      event.imageUrl = imageUrl;
      setEventData(event);
      fetchTypeTickets();
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const fetchTypeTickets = async () => {
    try {
      const typeTicketsData = await API.graphql(graphqlOperation(listTypeTickets, {
        filter: { eventID: { eq: eventId } }
      }));
      const typeTicketsList = typeTicketsData.data.listTypeTickets.items;
      setTypeTickets(typeTicketsList);
    } catch (error) {
      console.error("Error fetching type tickets:", error);
    }
  };

  const renderTypeTickets = () => {
    return typeTickets.map((typeTicket) => (
      <div key={typeTicket.id} style={typeTicket.activeTT ? {} : { opacity: 0.5, filter: 'grayscale(90%)' }}>
        <div class="create-ticket-container">
          <div class="ticket-column">
            <h2 class="ticket-text">{typeTicket.nameTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">${typeTicket.priceTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">Disponibles {typeTicket.quantityTT}</h2>
          </div>
          <div class="ticket-column">
            <ButtonTypeTicket typeTicketId={typeTicket.id} isActive={typeTicket.activeTT} onTypeTicketToggled={handleTypeTicketToggle} />
          </div>
        </div>
      </div>
    ));
  };

  const handleTypeTicketToggle = (typeTicketId, newActiveState) => {
    setTypeTickets((prevTypeTickets) => {
      return prevTypeTickets.map((ticket) => {
        if (ticket.id === typeTicketId) {
          return { ...ticket, activeTT: newActiveState };
        }
        return ticket;
      });
    });
  };

  const handleTypeTicketCreated = (newTypeTicket) => {
    setTypeTickets((prevTypeTickets) => [...prevTypeTickets, newTypeTicket]);
  };

  if (!eventData) {
    return <div></div>;
  }

  if (loading) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }


  return (
    <div className="eventClass">
      <br />
      <div className="test">
        {mapsApiLoaded && (
          <LoadScriptNext
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
            libraries={["places"]}
            onLoad={() => setMapsApiLoaded(true)}>
            <div className="edit-event-container">
              <div className="data-container">
                <div>
                  <h4 className="eventName"> {eventData.nameEvent}</h4>
                </div>
                <div>
                  <h4 className="eventDate"> {(eventData.startDateE).slice(0, 10)}</h4>
                </div>
                {eventData.descriptionEvent && (
                  <div>
                    <h4 className="eventDescription"> {eventData.descriptionEvent}</h4>
                  </div>
                )}
              </div>
              <div className="image-container">
                <img className="image-style" src={eventData.imageUrl} alt="" />
              </div>
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px"
                  }}
                  zoom={15}
                  center={selectedLocation || { lat: -34.397, lng: 150.644 }}
                >
                  {selectedLocation && (
                    <MarkerF position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                  )}
                </GoogleMap>
              </div>
            </div>
          </LoadScriptNext>
        )}
      </div>
      <br />
      {typeTickets.length > 0 ? (
        <>
          <div>
            <p className="textMessage1">TICKETS</p>
          </div>
          {renderTypeTickets()}
        </>
      ) : null}
      <div>
        <p className='textMessage1'>NUEVO TIPO DE TICKET</p>
      </div>
      <CreateTypeTicket eventId={eventId} onTypeTicketCreated={handleTypeTicketCreated} />
      <br />
    </div>
  );
};

export default EditEvent;
