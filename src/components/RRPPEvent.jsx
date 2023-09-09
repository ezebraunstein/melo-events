import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listTickets, getRRPPEvent } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import { LoadScriptNext } from "@react-google-maps/api";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import fetchEventData from '../functions/fetchEventData';
import fetchTypeTickets from '../functions/fetchTypeTickets';
import EventDetail from './EventDetail';
const GOOGLE_MAPS_LIBRARIES = ["places"];

const RRPPEvent = () => {

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
    const fetchData = async () => {
      try {
        const rrppEventResult = await API.graphql(graphqlOperation(getRRPPEvent, { id: rrppEventId }));
        const eventId = rrppEventResult.data.getRRPPEvent.Event.id;

        const fetchedEventData = await fetchEventData(eventId);
        setEventData(fetchedEventData);

        const typeCounts = await fetchTicketsAndCountByType(rrppEventId);
        const fetchedTypeTickets = await fetchTypeTickets(eventId, typeCounts);
        setTypeTickets(fetchedTypeTickets);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();

    setMapsApiLoaded(true);
  }, [rrppEventId]);

  useEffect(() => {
    if (eventData && eventData.locationEvent) {
      const locationEvent = JSON.parse(eventData.locationEvent);
      setSelectedLocation(locationEvent);
    }
  }, [eventData]);

  const fetchTicketsAndCountByType = async (rrppEventId) => {
    try {
      const ticketsData = await API.graphql(graphqlOperation(listTickets, { filter: { rrppeventID: { eq: rrppEventId } } }));
      const ticketsList = ticketsData.data.listTickets.items;

      return ticketsList.reduce((acc, ticket) => {
        acc[ticket.typeticketID] = (acc[ticket.typeticketID] || 0) + 1;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const renderTypeTickets = () => {
    return typeTickets.map((typeTicket) => (
      <div>
        <div key={typeTicket.id} class="ticket-containerRRPP">
          <div class="ticket-column">
            <h2 class="ticket-text">{typeTicket.nameTT}</h2>
          </div>
          <div class="ticket-column">
            <h2 class="ticket-text">{typeTicket.count}</h2>
          </div>
        </div>
      </div>
    ));
  };

  const copyEventLinkToClipboard = async () => {
    const link = `${baseUrl}/comprar-tickets/${eventData.id}/${rrppEventId}`;
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
    <div className="event-class">
      <br />
      <div className="test">
        {mapsApiLoaded && (
          <LoadScriptNext
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
            libraries={GOOGLE_MAPS_LIBRARIES}
            onLoad={() => setMapsApiLoaded(true)}>
            <EventDetail eventData={eventData} selectedLocation={selectedLocation} />
          </LoadScriptNext>
        )}
      </div>
      <br />
      <div>
        <p className='textMessage1'>MIS VENTAS</p>
      </div>
      <br />
      {renderTypeTickets()}
      <br />
      <div>
        <button type="button" class="btnMain" onClick={copyEventLinkToClipboard}>
          Copiar Link
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
