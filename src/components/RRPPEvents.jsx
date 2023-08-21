import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listRRPPEvents } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import ModalRRPPEvent from './ModalRRPPEvent';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth0 } from "@auth0/auth0-react";

//CLOUDFRONT URL
const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

const RRPPEvents = () => {

    const navigate = useNavigate();
    const [rrppEvents, setRrppEvents] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth0();

    useEffect(() => {
        fetchRrppEvents();
    }, [refreshKey]);

    const handleEventLinked = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const fetchRrppEvents = async () => {
        try {
            const rrppEventsData = await API.graphql(
                graphqlOperation(listRRPPEvents, {
                    filter: { rrppID: { eq: user.sub } },
                })
            );

            const rrppEventsList = rrppEventsData.data.listRRPPEvents.items;
            const rrppEventsWithImages = await Promise.all(
                rrppEventsList.map(async (rrppEvent) => {
                    const event = rrppEvent.Event;
                    const imagePath = `${event.flyerMiniEvent}`;
                    const imageUrl = `${cloudFrontUrl}/${imagePath}`;
                    rrppEvent.Event.imageUrl = imageUrl;
                    return rrppEvent;
                })
            );
            setRrppEvents(rrppEventsWithImages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rrpp events', error);
            setLoading(false);
        }
    };

    const handleButtonClick = (rrppEventId) => {
        navigate(`/mi-evento-rrpp/${rrppEventId}`);
    };

    if (loading) {
        return <div className="circular-progress">
            <CircularProgress />
        </div>
    }

    return (
        <div className="eventClass">
            {rrppEvents.length > 0 ? (
                <div id="boxes">
                    <h1 className="eventBoxTitle">Mis Eventos</h1>
                    <div className="eventBoxContainer">
                        {rrppEvents.map((rrppEvent) => (
                            <div>
                                <div key={rrppEvent.id} className="eventBox">
                                    <img src={rrppEvent.Event.imageUrl} />
                                    <h3 className="nameEventBox">{rrppEvent.Event.nameEvent}</h3>
                                    <button onClick={() => handleButtonClick(rrppEvent.id)} className="eventBoxBtnBuy">
                                        <i className="icon-ticket"></i>Acceder
                                    </button>
                                </div>
                                <div>
                                    <ModalRRPPEvent onEventLinked={handleEventLinked} user={user} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="containerMessage">
                    <div>
                        <h1 className='titleMessage'>No hay eventos vinculados</h1>
                    </div>
                    <div>
                        <h1 className='textMessage1'>Ingresá el código de evento</h1>
                    </div>
                    <div>
                        <ModalRRPPEvent onEventLinked={handleEventLinked} user={user} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RRPPEvents;
