import { useState, useEffect, useLayoutEffect, useRef } from "react";
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
    const hiddenFileInput = useRef(null);
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

    const handleImageClick = () => {
        hiddenFileInput.current.click();
    };

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
        let { name, value } = event.target;

        if (name === "startDateE") {

            const numbersOnly = value.replace(/\D/g, "");

            let newValue = numbersOnly;

            if (numbersOnly.length > 4) {
                newValue = numbersOnly.substring(0, 2) + "/" + numbersOnly.substring(2, 4) + "/" + numbersOnly.substring(4);
            } else if (numbersOnly.length > 2) {
                newValue = numbersOnly.substring(0, 2) + "/" + numbersOnly.substring(2);
            }

            value = newValue;
        } else {
            value = value.toUpperCase();
        }

        setEventData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (event) => {
        console.log(eventData.startDateE)
        debugger;
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
                navigate(`/editar-evento/${createEventInput.id}`);
            }, 1000);

        } catch (error) {

            setSnackbarMessage('Error al crear el evento!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

        } finally {
            setIsSubmitting(false);
        }
    };

    const autoGrowTextArea = (event) => {
        if (event.target) {
            event.target.style.height = "5px";
            event.target.style.height = (event.target.scrollHeight) + "px";
        }
    };

    if (isSubmitting) {
        return <div className="circular-progress">
            <CircularProgress />
        </div>
    }

    return (
        <div className="event-class">
            <br />
            <form onSubmit={handleSubmit}>
                {mapsApiLoaded && (
                    <LoadScriptNext
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
                        libraries={googleMapsLibraries}
                        onLoad={() => setMapsApiLoaded(true)}>
                        <div className="event-container">
                            <div className="input-container" >
                                <div>
                                    <input
                                        className="event-input"
                                        type="text"
                                        name="nameEvent"
                                        value={eventData.nameEvent}
                                        onChange={handleInputChange}
                                        placeholder={!eventData.nameEvent ? "NOMBRE*" : ""}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="event-input"
                                        type="text"
                                        name="startDateE"
                                        value={eventData.startDateE}
                                        onChange={handleInputChange}
                                        placeholder="DD/MM/YYYY"
                                        pattern="\d{2}/\d{2}/\d{4}"
                                        maxLength="10"
                                        inputMode="numeric"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="event-input"
                                        value={eventData.descriptionEvent}
                                        onChange={handleInputChange}
                                        name="descriptionEvent"
                                        rows="1"
                                        onInput={autoGrowTextArea}
                                        placeholder={!eventData.descriptionEvent ? "DESCRIPCIÓN (OPCIONAL)" : ""}
                                    />
                                </div>
                                <div>
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
                                            placeholder="UBICACIÓN (OPCIONAL)"
                                            className="event-input"
                                            style={{ width: "100%" }}
                                        />
                                    </StandaloneSearchBox>
                                </div>
                            </div>
                            <div className="image-container">
                                <img
                                    className={flyerMiniUrl ? "image-style" : "placeholder-style"}
                                    src={flyerMiniUrl ? flyerMiniUrl : placeholderImage}
                                    alt="Event Image"
                                    onClick={handleImageClick}
                                    style={{ cursor: "pointer" }}
                                />
                                <div className="image-overlay" onClick={handleImageClick}>
                                    <span>AGREGAR FLYER (FORMATO 1:1)</span>
                                </div>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFlyerMiniChange}
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