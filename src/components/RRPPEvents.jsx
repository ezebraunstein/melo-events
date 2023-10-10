import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listRRPPEvents } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import ModalRRPPEvent from './ModalRRPPEvent';
import CircularProgress from '@mui/material/CircularProgress';
import { getEvent } from "../graphql/queries";
import Marquee from "./Marquee";
import { useAuth0 } from "@auth0/auth0-react";

const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

const RRPPEvents = () => {
    const navigate = useNavigate();
    const [rrppEvents, setRrppEvents] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth0();

    useEffect(() => {
        fetchRrppEvents();
    });

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
                    const eventId = rrppEvent.rRPPEventEventId;

                    const eventResponse = await API.graphql(graphqlOperation(getEvent, { id: eventId }));
                    const eventData = eventResponse.data.getEvent;

                    const imagePath = `${eventData.flyerMiniEvent}`;
                    const imageUrl = `${cloudFrontUrl}/${imagePath}`;
                    eventData.imageUrl = imageUrl;

                    rrppEvent.Event = eventData;
                    return rrppEvent;
                })
            );
            setRrppEvents(rrppEventsWithImages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rrpp events', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = (rrppEventId) => {
        navigate(`/mi-evento-rrpp/${rrppEventId}`);
    };

    if (loading) {
        return (
            <div className="circular-progress">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <br />
            <br />
            <Marquee text="EVENTOS RRPP " />
            <br />
            <br />
            <div className="event-class">
                {rrppEvents.length > 0 ? (
                    <div id="boxes">
                        <div className="eventBoxContainer">
                            {rrppEvents.map((rrppEvent) => (
                                <div key={rrppEvent.id} className="eventBox" onClick={() => handleButtonClick(rrppEvent.id)} style={{ cursor: 'pointer' }}>
                                    <img src={rrppEvent.Event.imageUrl} className="imgEventBox" />
                                    <h3 className="nameEventBox">{rrppEvent.Event.nameEvent}</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleButtonClick(rrppEvent.id);
                                        }}
                                        className="eventBoxBtnBuy"
                                    >
                                        ACCEDER
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <ModalRRPPEvent onEventLinked={handleEventLinked} setLoading={setLoading} user={user} />
                        </div>
                        <br />
                        <br />
                    </div>
                ) : (
                    <div className="message-container">
                        <div>
                            <h1 className='titleMessage'>No hay eventos vinculados</h1>
                        </div>
                        <br />
                        <div>
                            <ModalRRPPEvent onEventLinked={handleEventLinked} setLoading={setLoading} user={user} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RRPPEvents;
