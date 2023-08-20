import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listTypeTickets, listTickets, getRRPPEvent, getEvent } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


const RRPPEvent = () => {

  //CLOUDFRONT URL
  const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

  //PARAMS
  const { rrppEventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [typeTickets, setTypeTickets] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  //API GOOGLE MAPS
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchRRPPEvent();
  }, [rrppEventId]);

  useEffect(() => {
    setMapsApiLoaded(true);
  }, []);

  useEffect(() => {
    if (eventData && eventData.locationEvent) {
      const locationEvent = JSON.parse(eventData.locationEvent);
      setSelectedLocation(locationEvent);
    }
  }, [eventData]);

  const fetchRRPPEvent = async () => {
    try {
      const rrppEventResult = await API.graphql(
        graphqlOperation(getRRPPEvent, { id: rrppEventId })
      );
      const rrppEvent = rrppEventResult.data.getRRPPEvent;
      const eventId = rrppEvent.Event.id;
      const typeCounts = await fetchTicketsAndCountByType(rrppEventId);
      await fetchEventData(eventId, typeCounts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching RRPP event:", error);
      setLoading(false);
    }
  };

  const fetchEventData = async (eventId, typeCounts) => {
    try {
      const eventResult = await API.graphql(
        graphqlOperation(getEvent, { id: eventId })
      );
      const event = eventResult.data.getEvent;
      const imagePath = `${event.flyerMiniEvent}`;
      const imageUrl = `${cloudFrontUrl}/${imagePath}`;
      event.imageUrl = imageUrl;
      setEventData(event);
      fetchTypeTickets(eventId, typeCounts);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const fetchTicketsAndCountByType = async (rrppEventId) => {
    try {
      const ticketsData = await API.graphql(graphqlOperation(listTickets, {
        filter: { rrppeventID: { eq: rrppEventId } }
      }));
      const ticketsList = ticketsData.data.listTickets.items;
      let typeCounts = {};
      ticketsList.forEach((ticket) => {
        typeCounts[ticket.typeticketID] = (typeCounts[ticket.typeticketID] || 0) + 1;
      });
      return typeCounts;
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchTypeTickets = async (eventId, typeCounts) => {
    try {
      const typeTicketsData = await API.graphql(graphqlOperation(listTypeTickets, {
        filter: { eventID: { eq: eventId } }
      }));
      const typeTicketsList = typeTicketsData.data.listTypeTickets.items.map((typeTicket) => ({
        ...typeTicket,
        count: typeCounts[typeTicket.id] || 0
      }));
      setTypeTickets(typeTicketsList);
    } catch (error) {
      console.error("Error fetching type tickets:", error);
    }
  };

  const renderTypeTickets = () => {
    return typeTickets.map((typeTicket) => (
      <div className="eventClass">
        <div key={typeTicket.id} class="ticket-containerRRPP">
          <div class="ticket-column">
            <h2 class="ticket-text">{typeTicket.nameTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">Vendidos: {typeTicket.count}</h2>
          </div>
        </div>
      </div>
    ));
  };

  const copyEventLinkToClipboard = async () => {
    const link = `${baseUrl}/buy-ticket/${eventData.id}/${rrppEventId}`;
    try {
      await navigator.clipboard.writeText(link);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div className="circular-progress">
      <CircularProgress />
    </div>
  }

  if (!eventData) {
    return <div></div>;
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
      {renderTypeTickets()}
      <br />
      <div>
        <button type="button" class="btnMain" onClick={copyEventLinkToClipboard}>
          Copiar Mi Link
        </button>
      </div>
      <br />
      <br />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Link copiado!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RRPPEvent;
