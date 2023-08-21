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
      const isDisabledOrAgotado = !typeTicket.activeTT || typeTicket.quantityTT <= 0;
      const ticketStyle = isDisabledOrAgotado ? { opacity: 0.5, filter: 'grayscale(30%)' } : {};

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
                  <button type="button" class="btn-Remove" disabled={isDisabledOrAgotado} onClick={() => addToCart(typeTicket, -1)}><i class="fas fa-minus"></i></button>
                  <span class="ticket-text">&nbsp;{quantity}&nbsp;</span>
                  <button type="button" class="btn-Add" disabled={isDisabledOrAgotado} onClick={() => addToCart(typeTicket, 1)}><i class="fas fa-plus"></i></button>
                </div>
              ) : (
                <div class="ticket-text">
                  {typeTicket.quantityTT <= 0 ? 'AGOTADO' : 'NO DISPONIBLE'}
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
      {typeTickets.length > 0 ? (
        <>
          {renderTypeTickets()}
        </>
      ) : null}
      <br />
      <ModalCheckout handleModalSubmit={handleModalSubmit} cart={cart} />
      <br />
      {isSubmitting && (
        <div className="circularProgress">
          <CircularProgress />
        </div>
      )}
      {rrppEventId && (
        <div className='textMessage3'>
          <br />
          <p>Estás usando el link de {nameRRPP} {surnameRRPP}</p>
        </div>
      )}
      <br />
    </div>
  );
};

export default BuyEvent;
