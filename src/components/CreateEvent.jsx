import { useState, useEffect, useLayoutEffect } from "react";
import { v4 as uuid } from "uuid";
import { withAuthenticator } from '@aws-amplify/ui-react';
import checkUser from './CheckUser';
import { useNavigate } from 'react-router-dom';
import CreateUser from './CreateUser';
import { GoogleMap, LoadScriptNext, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import CircularProgress from '@mui/material/CircularProgress';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import '@aws-amplify/ui-react/styles.css';

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.REACT_APP_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    }
});

function AddEvent({ user }) {

    //PARAMS
    const [eventData, setEventData] = useState({});
    const [flyerFile, setFlyerFile] = useState(null);
    const [flyerMiniFile, setFlyerMiniFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [showYourComponent, setShowYourComponent] = useState(false);

    //MUI ALERT
    const [loading, setLoading] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
        const checkUserExistence = async () => {
            const userExists = await checkUser(user);
            if (userExists) {
                setShowYourComponent(false);
            } else {
                setShowYourComponent(true);
            }
        };
        checkUserExistence();
    }, [user]);

    // const handleFlyerChange = (event) => {
    //     const file = event.target.files[0];
    //     setFlyerFile(file);
    // };

    // const handleFlyerMiniChange = (event) => {
    //     const file = event.target.files[0];
    //     setFlyerMiniFile(file);
    // };

    const [flyerUrl, setFlyerUrl] = useState(null);
    const [flyerMiniUrl, setFlyerMiniUrl] = useState(null);

    const handleFlyerChange = (event) => {
        const file = event.target.files[0];
        setFlyerFile(file);

        // Read the selected file and set the URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setFlyerUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFlyerMiniChange = (event) => {
        const file = event.target.files[0];
        setFlyerMiniFile(file);

        // Read the selected file and set the URL
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
            userID: user.username
        };

        if (flyerFile) {
            const flyerKey = `events/${createEventInput.id}/flyer`;
            const uploadParams = {
                Bucket: 'melo-tickets',
                Key: flyerKey,
                Body: flyerFile,
                ContentType: 'image/jpeg'
            };
            await s3Client.send(new PutObjectCommand(uploadParams));
            createEventInput.flyerEvent = flyerKey;
        }

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
            debugger;
            const response = await axios.post('https://z5wba3v4bvkxdytxba23ma2ajm0qcjed.lambda-url.us-east-1.on.aws/', JSON.stringify({ createEventInput: createEventInput }), {
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
        <>
            {showYourComponent && <CreateUser />}
            <div className="eventClass">
                <br />
                <div>
                    <p className='textMessage1'>CREAR EVENTO</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {mapsApiLoaded && (
                        <LoadScriptNext
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS}
                            libraries={googleMapsLibraries}
                            onLoad={() => setMapsApiLoaded(true)}
                        >
                            <div style={{ display: 'flex' }}>
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
                                        </label>
                                    </div>

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
                    <div className="label-container">
                        <div>
                            <label className='labelEvent'>
                                Flyer 1:1*
                                <input className='inputEvent'
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    name="flyerMiniEvent"
                                    onChange={handleFlyerMiniChange}
                                />
                            </label>
                            {/* {flyerMiniUrl && <img src={flyerMiniUrl} alt="Flyer Mini Preview" className="flyerMiniImg" />} */}
                        </div>
                        <div>
                            <label className='labelEvent'>
                                Flyer 16:9 (opcional)
                                <input className='inputEvent'
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    name="flyerEvent"
                                    onChange={handleFlyerChange}
                                />
                            </label>
                            {/* {flyerUrl && <img src={flyerUrl} alt="Flyer Preview" className="flyerImg" />} */}
                        </div>
                    </div>
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
        </>
    );
};

export default withAuthenticator(AddEvent);