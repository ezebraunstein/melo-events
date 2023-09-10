import { API, graphqlOperation } from 'aws-amplify';
import { updateEvent } from '../graphql/mutations';
import { useParams } from 'react-router-dom';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useState, useEffect, useRef } from 'react';
import CreateTypeTicket from './CreateTypeTicket';
import { GoogleMap, LoadScriptNext, MarkerF, StandaloneSearchBox } from "@react-google-maps/api";
import ButtonTypeTicket from './ButtonTypeTicket';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import fetchEventData from '../functions/fetchEventData';
import fetchTypeTickets from '../functions/fetchTypeTickets';
import TicketIcon from './TicketIcon';
import Marquee from './Marquee';
const GOOGLE_MAPS_LIBRARIES = ["places"];

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  }
});

const EditEvent = () => {

  //PARAMS
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [typeTickets, setTypeTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedEventData, setEditedEventData] = useState({});

  // const [displayedImageUrl, setDisplayedImageUrl] = useState(null);
  const [displayedImageUrl, setDisplayedImageUrl] = useState(eventData ? eventData.imageUrl : null);
  const [newImageFile, setNewImageFile] = useState(null);
  const hiddenFileInput = useRef(null);

  //API GOOGLE MAPS
  const [mapsApiLoaded, setMapsApiLoaded] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationName, setLocationName] = useState("");

  //MUI ALERT
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMapsApiLoaded(true);
  }, []);

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

  useEffect(() => {
    if (eventData) {
      const locationEvent = JSON.parse(eventData.locationEvent);
      setSelectedLocation(locationEvent);
      setEditedEventData({
        nameEvent: eventData.nameEvent,
        startDateE: formatDateToDisplay(eventData.startDateE),
        descriptionEvent: eventData.descriptionEvent,
        locationEvent: JSON.stringify(locationEvent),
        nameLocationEvent: eventData.nameLocationEvent,
        flyerMiniEvent: "",
      });

      setLocationName(eventData.nameLocationEvent);
    }
  }, [eventData]);

  useEffect(() => {
    setEditedEventData(prevState => ({
      ...prevState,
      locationEvent: JSON.stringify(selectedLocation),
      nameLocationEvent: locationName
    }));
  }, [selectedLocation, locationName]);

  useEffect(() => {
    if (editedEventData.descriptionEvent) {
      const event = {
        target: document.querySelector('[name="descriptionEvent"]')
      };
      autoGrowTextArea(event);
    }
  }, [editedEventData.descriptionEvent]);

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "startDateE") {
      const numbersOnly = value.replace(/\D/g, "");
      let newValue = numbersOnly;
      if (numbersOnly.length > 4) {
        newValue = numbersOnly.substring(0, 2) + "/" + numbersOnly.substring(2, 4) + "/" + numbersOnly.substring(4);
      } else if (numbersOnly.length > 2) {
        newValue = numbersOnly.substring(0, 2) + "/" + numbersOnly.substring(2);
      }
      formattedValue = newValue;
    } else {
      formattedValue = value.toUpperCase();
    }
    setEditedEventData(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  const formatDateToDisplay = (date) => {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // const formatDateToDisplay = (dateStr) => {
  //   const dateObj = new Date(dateStr);
  //   const dd = String(dateObj.getDate()).padStart(2, '0');
  //   const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
  //   const yyyy = dateObj.getFullYear();
  //   return `${dd}/${mm}/${yyyy}`;
  // };


  const formatDateToSave = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSaveChanges = async () => {

    setIsSubmitting(true);

    const updatedEventData = {
      ...editedEventData,
      startDateE: formatDateToSave(editedEventData.startDateE)
    };

    if (newImageFile) {
      const timestamp = Date.now();
      const flyerKey = `events/${eventId}/flyerMini-${timestamp}`;
      const uploadParams = {
        Bucket: 'melo-tickets',
        Key: flyerKey,
        Body: newImageFile,
        ContentType: 'image/jpeg'
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      editedEventData.flyerMiniEvent = flyerKey;
    } else {
      editedEventData.flyerMiniEvent = eventData.flyerMiniEvent;
    }

    try {
      await API.graphql(graphqlOperation(updateEvent, {
        input: {
          id: eventId,
          ...updatedEventData,
        }
      }));

      setSnackbarMessage('Evento editado con éxito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {

      setSnackbarMessage('Error al crear el evento!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      console.error('Error updating event:', error);
    } finally {
      setIsSubmitting(false);
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
            <h2 class="ticket-text"><TicketIcon /> {typeTicket.quantityTT}</h2>
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

  const handleImageClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setDisplayedImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!eventData) {
    return <div></div>;
  }

  if (isSubmitting) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }

  const autoGrowTextArea = (event) => {
    if (event.target) {
      event.target.style.height = "5px";
      event.target.style.height = (event.target.scrollHeight) + "px";
    }
  };

  return (
    <>
      <br />
      <br />
      <Marquee text={eventData.nameEvent} />
      <br />
      <br />
      <div className="event-class">
        <br />
        <div>
          {mapsApiLoaded && (
            <LoadScriptNext
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
              libraries={GOOGLE_MAPS_LIBRARIES}
              onLoad={() => setMapsApiLoaded(true)}>
              <div className="event-container">
                <div className="input-container">
                  <div>
                    <input
                      className="event-input"
                      type="text"
                      value={editedEventData.nameEvent}
                      onChange={handleInputChange}
                      name="nameEvent"
                    />
                  </div>
                  <div>
                    <input
                      className="event-input"
                      type="text"
                      name="startDateE"
                      maxLength="10"
                      value={editedEventData.startDateE}
                      placeholder="dd/mm/yyyy"
                      inputMode="numeric"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <textarea
                      className="event-input"
                      value={editedEventData.descriptionEvent}
                      placeholder="(DESCRIPCIÓN)"
                      onChange={handleInputChange}
                      name="descriptionEvent"
                      rows="1"
                      onInput={autoGrowTextArea}
                    />
                  </div>
                  <label className="label-input">
                    <StandaloneSearchBox
                      onLoad={(ref) => setMapRef(ref)}
                      onPlacesChanged={() => {
                        const place = mapRef.getPlaces()[0];
                        if (place) {
                          setSelectedLocation({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                          });
                          setLocationName(place.name);
                        }
                      }}
                    >
                      <input
                        type="text"
                        value={locationName}
                        placeholder="(SECRET LOCATION)"
                        onChange={e => setLocationName(e.target.value)}
                        className="event-input"
                        style={{ width: "100%" }} />
                    </StandaloneSearchBox>
                  </label>
                </div>
                <div className="image-container">
                  <img
                    className="image-style"
                    src={displayedImageUrl || eventData.imageUrl}
                    alt="Event Image"
                    onClick={handleImageClick}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="image-overlay" onClick={handleImageClick}>
                    <span>CAMBIAR IMAGEN</span>
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={hiddenFileInput}
                  />
                </div>
                <div className="map-container" >
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "100%",
                      borderRadius: '10px'
                    }}
                    zoom={15}
                    center={selectedLocation || { lat: -34.397, lng: 150.644 }}
                    onClick={(e) =>
                      setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                    }
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
        <br />
        <button className='btnMain' onClick={handleSaveChanges}>Guardar Cambios</button>
        <br />
        {typeTickets.length > 0 ? (
          <>
            <br />
            <br />
            <div>
              <p className="textMessage1">TICKETS</p>
            </div>
            <br />
            {renderTypeTickets()}
          </>
        ) : null}
        <br />
        <br />
        <div>
          <p className='textMessage1'>NUEVO TICKET</p>
        </div>
        <br />
        <CreateTypeTicket eventId={eventId} onTypeTicketCreated={handleTypeTicketCreated} />
        <br />
        <br />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default EditEvent;
