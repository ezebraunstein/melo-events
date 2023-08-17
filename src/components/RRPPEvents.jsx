import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listRRPPEvents } from '../graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import ModalRRPPEvent from './ModalRRPPEvent';
import CircularProgress from '@mui/material/CircularProgress';

//CLOUDFRONT URL

const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

const RRPPEvents = ({ user }) => {

    const navigate = useNavigate();
    const [rrppEvents, setRrppEvents] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);


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
                    filter: { rrppID: { eq: user.username } },
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
        navigate(`/rrpp-events/${rrppEventId}`);
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 999 }}>
            <CircularProgress />
        </div>
    }

    return (
        <div id="boxes">
            <h1 className="eventBoxTitle">Mis Eventos RRPP</h1>
            <ModalRRPPEvent onEventLinked={handleEventLinked} user={user} />
            <div className="eventBoxContainer">
                <div>
                    {rrppEvents.length === 0 ? (
                        <div >
                            <br />
                            <p className='titleMessage'>No hay eventos vinculados</p>
                            <p className='textMessage1'>Ingresá el código de evento</p>
                        </div>
                    ) : (
                        rrppEvents.map((rrppEvent) => (
                            <div key={rrppEvent.id} className="eventBox">
                                <img src={rrppEvent.Event.imageUrl} />
                                <h3 className="nameEventBox">{rrppEvent.Event.nameEvent}</h3>
                                <button onClick={() => handleButtonClick(rrppEvent.id)} className="eventBoxBtnBuy">
                                    <i className="icon-ticket"></i>Acceder
                                </button>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
};

export default withAuthenticator(RRPPEvents);
