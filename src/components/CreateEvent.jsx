import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import axios from 'axios';
import { GoogleMap, LoadScriptNext, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import CircularProgress from '@mui/material/CircularProgress';
import '@aws-amplify/ui-react/styles.css';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import placeholderImage from '../images/placeholder.jpg';
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.REACT_APP_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    }
});

function AddEvent() {

    //AUTH0 USER
    const { user } = useAuth0();

    //PARAMS
    const [eventData, setEventData] = useState({});
    const [flyerMiniFile, setFlyerMiniFile] = useState(null);
    const [showYourComponent, setShowYourComponent] = useState(false);
    const [flyerMiniUrl, setFlyerMiniUrl] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const navigate = useNavigate();

    //MUI ALERT
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    //API GOOGLE MAPS
    const [mapsApiLoaded, setMapsApiLoaded] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const googleMapsLibraries = ["places"];
    const [locationName, setLocationName] = useState("");

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSelectedLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useLayoutEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        setMapsApiLoaded(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleFlyerMiniChange = (event) => {
        const file = event.target.files[0];
        setFlyerMiniFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFlyerMiniUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value.toUpperCase()
        }));
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleDateChange = (date) => {
        setEventData((prevData) => ({
            ...prevData,
            startDateE: date,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const createEventInput = {
            id: uuid(),
            nameEvent: eventData.nameEvent,
            locationEvent: JSON.stringify(selectedLocation),
            descriptionEvent: eventData.descriptionEvent,
            flyerMiniEvent: "",
            flyerEvent: "",
            startDateE: new Date(eventData.startDateE),
            upDateE: new Date(),
            downDateE: new Date(),
            nameLocationEvent: locationName,
            userID: user.sub
        };

        if (flyerMiniFile) {
            const flyerMiniKey = `events/${createEventInput.id}/flyerMini`;
            const uploadParams = {
                Bucket: 'melo-tickets',
                Key: flyerMiniKey,
                Body: flyerMiniFile,
                ContentType: 'image/jpeg'
            };
            await s3Client.send(new PutObjectCommand(uploadParams));
            createEventInput.flyerMiniEvent = flyerMiniKey;
        }

        try {
            await axios.post('https://z5wba3v4bvkxdytxba23ma2ajm0qcjed.lambda-url.us-east-1.on.aws/', JSON.stringify({ createEventInput: createEventInput }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSnackbarMessage('Evento creado con éxito!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate(`/edit-event/${createEventInput.id}`);
            }, 1000);

        } catch (error) {

            setSnackbarMessage('Error al crear el evento!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
            <CircularProgress />
        </div>
    }

    return (
        <div className="eventClass">
            <br />
            <div>
                <p className='textMessage1'>CREAR EVENTO</p>
            </div>
            <form className="form-content" onSubmit={handleSubmit}>
                {mapsApiLoaded && (
                    <LoadScriptNext
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
                        libraries={googleMapsLibraries}
                        onLoad={() => setMapsApiLoaded(true)}
                    >
                        <div className="create-event-container">
                            <div className="input-container" >
                                <label className="labelEvent">
                                    <input
                                        className="inputEvent"
                                        type="text"
                                        name="nameEvent"
                                        value={eventData.nameEvent}
                                        onChange={handleInputChange}
                                        placeholder={!eventData.nameEvent ? "Nombre*" : ""}
                                    />
                                </label>
                                <label className="labelEvent">
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
                                            placeholder="ubicación (opcional)"
                                            className="inputEvent"
                                            style={{ width: "100%" }}
                                        />
                                    </StandaloneSearchBox>
                                </label>
                                <label className="labelEvent">
                                    <input className="inputEvent"
                                        type="text"
                                        name="descriptionEvent"
                                        value={eventData.descriptionEvent}
                                        onChange={handleInputChange}
                                        placeholder={!eventData.descriptionEvent ? "Descripción (opcional)" : ""}
                                    />
                                </label>
                                <div>
                                    <label className='labelEvent'>
                                        Fecha Inicio:
                                    </label>
                                    <input className='inputEvent'
                                        type="date"
                                        name="startDateE"
                                        value={eventData.startDateE}
                                        onChange={handleInputChange}
                                        placeholder={!eventData.nameEvent ? "Campo obligatorio" : ""}
                                    ></input>
                                </div>
                                <div >
                                    <label className='labelEvent'>
                                        Flyer (formato 1:1)*
                                        <input className='inputEvent'
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            name="flyerMiniEvent"
                                            onChange={handleFlyerMiniChange}
                                        />
                                    </label>
                                </div>
                                {/* <div className="date-flyer-container">
                                        <div className="date-container">
                                            <label className='labelEvent'>
                                                Fecha Inicio:
                                                {isMobile ? (
                                                    <MobileDatePicker
                                                        value={eventData.startDateE}
                                                        onChange={(date) => handleDateChange(date)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                ) : (
                                                    <DesktopDatePicker
                                                        value={eventData.startDateE}
                                                        onChange={(date) => handleDateChange(date)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                )}
                                            </label>
                                        </div>
                                        <div className="flyer-container">
                                            <label className='labelEvent'>
                                                Flyer (formato 1:1)*
                                                <input className='inputEvent'
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="flyerMiniEvent"
                                                    onChange={handleFlyerMiniChange}
                                                />
                                            </label>
                                        </div>
                                    </div> */}

                            </div>
                            <div className="image-container">
                                {flyerMiniUrl ? (
                                    <img src={flyerMiniUrl} alt="Flyer Mini Preview" className="image-style" />
                                ) : (
                                    <img src={placeholderImage} alt="Flyer Mini Preview" className="placeholder-style" />
                                )}
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
                                        <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                                    )}
                                </GoogleMap>
                            </div>
                        </div>
                    </LoadScriptNext>
                )}
                <br />
                <br />
                <div style={{ textAlign: 'center' }}>
                    <button className='btnMain' type="submit" disabled={!eventData.nameEvent || !eventData.startDateE || !flyerMiniFile || isSubmitting}>Agregar Evento</button>
                </div>
            </form>
            <br />
            <br />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>

    );
};

export default AddEvent;