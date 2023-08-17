import { API, graphqlOperation, Storage } from "aws-amplify";
import { listEvents } from "../graphql/queries";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import { CircularProgress } from "@mui/material";

const HomeEvents = () => {

    //CLOUDFRONT URL

    const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

    //PARAMS
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    //MUI LOADING
    const [loading, setLoading] = useState(true);


    const handleSearch = (searchQuery) => {
        if (searchQuery === "") {
            setFilteredEvents(events);
        } else {
            const fuse = new Fuse(events, {
                keys: ["nameEvent"],
                threshold: 0.3,
            });
            const results = fuse.search(searchQuery);
            setFilteredEvents(results.map((result) => result.item));
        }
    };

    const fetchEvents = async () => {
        try {
            const eventsData = await API.graphql(graphqlOperation(listEvents));
            const eventsList = eventsData.data.listEvents.items;
            const eventsWithImages = await Promise.all(
                eventsList.map(async (event) => {
                    const imagePath = `${event.flyerMiniEvent}`;
                    const imageUrl = `${cloudFrontUrl}/${imagePath}`;
                    event.imageUrl = imageUrl;
                    return event;
                })
            );
            setEvents(eventsWithImages);
            setFilteredEvents(eventsWithImages);
        } catch (error) {
            console.log("", error);
        }
    };

    const goToBuyEvent = (eventId) => {
        navigate(`/buy-ticket/${eventId}`);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div id="boxes">
            <h1 className="eventBoxTitle">Eventos Destacados</h1>
            <SearchBar onSearch={handleSearch} />
            <div className="eventBoxContainer">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="eventBox">
                        <img src={event.imageUrl} alt={event.nameEvent} className="imgEventBox" />
                        <h3 className="nameEventBox">{event.nameEvent}</h3>
                        <button onClick={() => goToBuyEvent(event.id)} className="eventBoxBtnBuy">Comprar Tickets</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeEvents;
