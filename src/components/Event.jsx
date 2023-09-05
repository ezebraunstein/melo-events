import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import CircularProgress from '@mui/material/CircularProgress';
import fetchEventData from '../functions/fetchEventData';
import fetchTypeTickets from '../functions/fetchTypeTickets';
const GOOGLE_MAPS_LIBRARIES = ["places"];
const Event = () => {

  //PARAMS
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [typeTickets, setTypeTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  //NAVIGATE
  const navigate = useNavigate();

  //API GOOGLE MAPS
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    const fetchData = async () => {
      const event = await fetchEventData(eventId);
      setEventData(event);
      try {
        const tickets = await fetchTypeTickets(eventId);
        setTypeTickets(tickets);
      } catch (error) {
        console.error("Error fetching type tickets:", error);
      }
    };
    fetchData();
  }, [eventId]);

  const renderTypeTickets = () => {
    return typeTickets.map((typeTicket) => (
      <div key={typeTicket.id} style={typeTicket.activeTT ? {} : { opacity: 0.5, filter: 'grayscale(90%)' }}>
        <div key={typeTicket.id} class="ticket-container">
          <div class="ticket-column">
            <h2 class="ticket-text">{typeTicket.nameTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">${typeTicket.priceTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">Disponibles {typeTicket.quantityTT}</h2>
          </div>
        </div>
      </div>
    ));
  };

  if (!eventData) {
    return <div></div>;
  }

  const handleEditEvent = () => {
    navigate(`/editar-evento/${eventId}`);
  };

  const redirectRRPP = () => {
    navigate(`/mi-evento/${eventId}/rrpp`);
  };

  // if (loading) {
  //   return <div className="circular-progress">
  //     <CircularProgress />
  //   </div>
  // }

  return (
    <div className="eventClass">
      <br />
      <div className="test">
        {mapsApiLoaded && (
          <LoadScriptNext
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
            libraries={GOOGLE_MAPS_LIBRARIES}
            onLoad={() => setMapsApiLoaded(true)}>
            <div className="event-container">
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
                {eventData.nameLocationEvent ? (
                  <div>
                    <h4 className="eventLocation">📍{eventData.nameLocationEvent}</h4>
                  </div>
                ) : (
                  <div>
                    <h4 className="eventLocation">📍Secret Location</h4>
                  </div>
                )}
              </div>
              <div className="image-container">
                <img className="image-style" src={eventData.imageUrl} alt="" />
              </div>
              {eventData.nameLocationEvent && (
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
              )}
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
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btnMain" onClick={handleEditEvent} style={{ marginRight: '50px' }}>
          Editar Evento
        </button>
        <button className="btnMain" onClick={redirectRRPP}>
          Ver Públicas
        </button>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Event;
