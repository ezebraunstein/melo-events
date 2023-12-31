import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import fetchEvents from "../functions/fetchEvents";
import Marquee from "./Marquee";
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
        <>
            <br />
            <br />
            <Marquee text="EVENTOS " />
            <br />
            <br />
            <div className="event-class">
                <div id="boxes">
                    <SearchBar onSearch={handleSearch} />
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
                                    Comprar
                                </button>
                            </div>
                        ))}
                    </div>
                    <br />
                </div>
            </div>
        </>
    );

};

export default HomeEvents;
