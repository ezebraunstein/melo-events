import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { getEvent } from '../graphql/queries';
import { listTypeTickets } from '../graphql/queries';
import { listTickets } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { getRRPPEvent } from '../graphql/queries';
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import { Snackbar } from '@mui/material';
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


  //API GOOGLE MAPS
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  useEffect(() => {
    setMapsApiLoaded(true);
  }, []);

  useEffect(() => {
    fetchRRPPEvent();
  }, [rrppEventId]);

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
      const imagePath = `${event.flyerEvent}`;
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
      <div className='eventClass'>
        <br />
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
      <CircularProgress />
    </div>
  }

  if (!eventData) {
    return <div></div>;
  }

  return (
    <main>
      <div className="eventClass">
        <br />
        <div>
          <h4 className="eventName">{eventData.nameEvent}</h4>
        </div>
        <div>
          <h4 className="eventDate">{(eventData.startDateE).slice(0, 10)}</h4>
        </div>
        {eventData.descriptionEvent && (
          <div>
            <h4 className="eventDescription"> {eventData.descriptionEvent}</h4>
          </div>
        )}
        {/* <div>
          {/* <div style={{ display: "flex", padding: "10px" }}>
            <img className="imgEvent" src={eventData.imageUrl} alt="" width="60%" height="300px" />
            {mapsApiLoaded && (
              <LoadScriptNext
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
                libraries={["places"]}
                onLoad={() => setMapsApiLoaded(true)}>
                <GoogleMap
                  mapContainerStyle={{
                    width: "40%",
                    height: "400px",
                    marginLeft: "10px",
                    borderRadius: "10px"
                  }}
                  zoom={15}
                  center={selectedLocation || { lat: -34.397, lng: 150.644 }}
                >
                  {selectedLocation && (
                    <MarkerF position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                  )}
                </GoogleMap>
              </LoadScriptNext>
            )}
          </div> 
        </div> */}
        <br />
        <div>
          <button type="button" class="btnMain" onClick={copyEventLinkToClipboard}>
            Copiar Mi Link
          </button>
        </div>
        {renderTypeTickets()}
        <br />
        <br />
        <br />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Link copiado!
          </Alert>
        </Snackbar>
      </div>
    </main>
  );
};

export default RRPPEvent;
