import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import fetchEvents from "../functions/fetchEvents";
import { CircularProgress } from "@mui/material";

const HomeEvents = () => {

    //PARAMS
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    //MUI LOADING
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const fetchedEvents = await fetchEvents();
                setEvents(fetchedEvents);
                setFilteredEvents(fetchedEvents);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        })();
    }, []);

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

    const goToBuyEvent = (event) => {
        navigate(`/comprar-tickets/${event.id}`);
    };

    if (loading) {
        return <div className="circular-progress">
            <CircularProgress />
        </div>
    }

    return (
        <div className="eventClass">
            <div id="boxes">
                <h1 className="eventBoxTitle">Eventos Destacados</h1>
                <br />
                <SearchBar onSearch={handleSearch} />
                <br />
                <div className="eventBoxContainer">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="eventBox" onClick={() => goToBuyEvent(event)} style={{ cursor: 'pointer' }}>
                            <img src={event.imageUrl} alt={event.nameEvent} className="imgEventBox" />
                            <h3 className="nameEventBox">{event.nameEvent}</h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToBuyEvent(event);
                                }}
                                className="eventBoxBtnBuy"
                            >
                                Comprar Tickets
                            </button>
                        </div>
                    ))}
                </div>
                <br />
            </div>
        </div>
    );

};

export default HomeEvents;
