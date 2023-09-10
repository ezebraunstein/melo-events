import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { getRRPP, getRRPPEvent } from '../graphql/queries';
import ModalCheckout from './ModalCheckout';
import stripeCheckout from '../functions/stripeCheckout';
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import { CircularProgress } from '@mui/material';
import fetchEventData from '../functions/fetchEventData';
import fetchTypeTickets from '../functions/fetchTypeTickets';
import EventDetail from './EventDetail';
import Marquee from './Marquee';

const BuyEvent = () => {

  //PARAMS
  const { eventId, rrppEventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [nameRRPP, setNameRRPP] = useState(null);
  const [surnameRRPP, setSurnameRRPP] = useState(null);
  const [typeTickets, setTypeTickets] = useState([]);
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      fetchRRPPEvent(rrppEventId);
    };
    fetchData();
  }, [eventId]);

  const handleModalSubmit = async (data) => {
    setIsSubmitting(true);
    await stripeCheckout(cart, data, eventData);
    //await mercadopagoCheckout(data, path, cart, eventData);
  };

  const fetchRRPPEvent = async (rrppEventId) => {
    try {
      const rrppEventData = await API.graphql(graphqlOperation(getRRPPEvent, { id: rrppEventId }));
      const rrppEvent = rrppEventData.data.getRRPPEvent;
      const rrppID = rrppEvent.rrppID;
      fetchRRPP(rrppID);
    } catch (error) {
      console.error("Error fetching RRPP:", error);
    }
  };

  const fetchRRPP = async (rrppID) => {
    try {
      const rrppData = await API.graphql(graphqlOperation(getRRPP, { id: rrppID }));
      const rrpp = rrppData.data.getRRPP;
      const nameRRPP = rrpp.nameRRPP;
      const surnameRRPP = rrpp.surnameRRPP;
      setNameRRPP(nameRRPP);
      setSurnameRRPP(surnameRRPP);
    } catch (error) {
      console.error("Error fetching RRPP:", error);
    }
  };

  const renderTypeTickets = () => {
    return typeTickets.map((typeTicket) => {

      const cartItem = cart.find((item) => item.id === typeTicket.id);
      const quantity = cartItem ? cartItem.selectedQuantity : 0;

      const isAgotado = typeTicket.quantityTT <= 0;
      const isDisabled = !typeTicket.activeTT;

      if (isDisabled) {
        return null;
      }

      const ticketStyle = isAgotado ? { opacity: 0.5, filter: 'grayscale(30%)' } : {};

      return (
        <div key={typeTicket.id} style={ticketStyle}>
          <br />
          <div key={typeTicket.id} class="ticket-container">
            <div class="ticket-column">
              <h2 class="ticket-text">{typeTicket.nameTT}</h2>
            </div>
            <div class="ticket-column">
              <h2 class="ticket-text">${typeTicket.priceTT}</h2>
            </div>
            <div class="ticket-column">
              {typeTicket.activeTT && typeTicket.quantityTT > 0 ? (
                <div class="quantity-container">
                  <button type="button" class="btn-Remove" disabled={isAgotado} onClick={() => addToCart(typeTicket, -1)}><i class="fas fa-minus"></i></button>
                  <span class="ticket-text">&nbsp;{quantity}&nbsp;</span>
                  <button type="button" class="btn-Add" disabled={isAgotado} onClick={() => addToCart(typeTicket, 1)}><i class="fas fa-plus"></i></button>
                </div>
              ) : (
                <div class="ticket-text">
                  'AGOTADO'
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };


  const addToCart = (typeTicket, quantity) => {
    const existingItemIndex = cart.findIndex((item) => item.id === typeTicket.id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].selectedQuantity += quantity;
      if (updatedCart[existingItemIndex].selectedQuantity <= 0) {
        updatedCart.splice(existingItemIndex, 1);
      }
      setCart(updatedCart);
    } else if (quantity > 0) {
      setCart([...cart, { ...typeTicket, selectedQuantity: quantity, rrppEventId: rrppEventId }]);
    }
  };

  const isAnyTicketAvailable = typeTickets.some(typeTicket => typeTicket.activeTT && typeTicket.quantityTT > 0);

  if (!eventData) {
    return <div></div>;
  }

  return (
    <>
      <br />
      <br />
      <Marquee text={eventData.nameEvent} />
      <br />
      <br />
      < div className="event-class" >
        <br />
        <div>
          {mapsApiLoaded && (
            <LoadScriptNext
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
              libraries={["places"]}
              onLoad={() => setMapsApiLoaded(true)}>
              <EventDetail eventData={eventData} selectedLocation={selectedLocation} />
            </LoadScriptNext>
          )}
        </div>
        <br />
        {
          typeTickets.length > 0 ? (
            <>
              {renderTypeTickets()}
            </>
          ) : null
        }
        <br />
        {
          isAnyTicketAvailable ? (
            <ModalCheckout handleModalSubmit={handleModalSubmit} cart={cart} />
          ) : (
            <button disabled className="btnMain">No hay tickets disponibles</button>
          )
        }
        <br />
        <br />
        {
          isSubmitting && (
            <div className="circularProgress">
              <CircularProgress />
            </div>
          )
        }
        {
          rrppEventId && (
            <div className='textMessage3'>
              <br />
              <p>Estás usando el link de {nameRRPP} {surnameRRPP}</p>
            </div>
          )
        }
        <br />
      </div >
    </>
  );
};

export default BuyEvent;
