import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listRRPPEvents, getRRPP, listTickets, listTypeTickets } from '../graphql/queries';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


const RRPPData = () => {

  const { eventId } = useParams();
  const [rrpps, setRrpps] = useState([]);
  const [typeTicketsData, setTypeTicketsData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchRRPPEvents();
  }, [eventId]);

  const fetchRRPPEvents = async () => {
    try {
      const rrppEventData = await API.graphql(graphqlOperation(listRRPPEvents));
      const filteredRRPPEvents = rrppEventData.data.listRRPPEvents.items.filter(
        item => item.Event.id === eventId
      );

      const rrppIDs = filteredRRPPEvents.map(item => item.rrppID);
      const rrppPromises = rrppIDs.map(rrppID => API.graphql(graphqlOperation(getRRPP, { id: rrppID })));
      const rrppData = await Promise.all(rrppPromises);
      setRrpps(rrppData.map(res => res.data.getRRPP));
      debugger;
      const typeTicketsData = {};
      for (const rrppEvent of filteredRRPPEvents) {
        typeTicketsData[rrppEvent.rrppID] = await fetchTicketsAndCountByType(rrppEvent.id, eventId);
      }
      setTypeTicketsData(typeTicketsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching RRPPEvents:", error);
      setLoading(false);
    }
  };

  const fetchTicketsAndCountByType = async (rrppEventId, eventId) => {
    try {
      const ticketsData = await API.graphql(graphqlOperation(listTickets, {
        filter: { rrppeventID: { eq: rrppEventId } }
      }));
      const ticketsList = ticketsData.data.listTickets.items;
      let typeCounts = {};
      ticketsList.forEach((ticket) => {
        typeCounts[ticket.typeticketID] = (typeCounts[ticket.typeticketID] || 0) + 1;
      });

      const typeTicketsData = await API.graphql(graphqlOperation(listTypeTickets, {
        filter: { eventID: { eq: eventId } }
      }));
      const typeTicketsList = typeTicketsData.data.listTypeTickets.items.map((typeTicket) => ({
        ...typeTicket,
        count: typeCounts[typeTicket.id] || 0
      }));

      return typeTicketsList;
    } catch (error) {
      console.error("Error fetching tickets and type tickets:", error);
    }
  };


  const renderTypeTickets = (rrppId) => {
    const typeTickets = typeTicketsData[rrppId];
    return typeTickets && typeTickets.map((typeTicket) => (
      <div >
        <div key={typeTicket.id} className="ticket-containerRRPP">
          <div className="ticket-column">
            <h2 className="ticket-text">{typeTicket.nameTT}</h2>
          </div>
          <div className="ticket-column">
            <h2 className="ticket-text">Vendidos {typeTicket.count}</h2>
          </div>
        </div>
      </div>
    ));
  };

  const copyEventIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventId);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy event id: ', err);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
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

  return (
    <main>
      <div className="eventClass">
        <div>
          {rrpps.length === 0 ? (
            <div className='containerMessage'>
              <div>
                <h1 className='titleMessage'>No hay públicas vinculados a este evento</h1>
              </div>
              <div>
                <h1 className='textMessage1'>Copiá el código y compartíselos</h1>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btnMain" onClick={copyEventIdToClipboard} >
                  Copiar Código Públicas
                </button>
              </div>
            </div>
          ) : (
            rrpps.map((rrpp) => (
              <div >
                <h1 className="eventBoxTitle">Mis Públicas</h1>
                <div key={rrpp.id}>
                  <h3 className='nameRRPP'>{rrpp.nameRRPP} {rrpp.surnameRRPP}</h3>
                  {renderTypeTickets(rrpp.id)}
                  <br />
                  <br />
                </div>
              </div>
            )))}
        </div>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Código copiado!
          </Alert>
        </Snackbar>
      </div>
    </main>
  );
};


export default RRPPData;
