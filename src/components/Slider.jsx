import { useState, useEffect } from "react";
import fetchEvents from "../functions/fetchEvents";

const Slider = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  return (
    <div className="slider">
      <div className="slider-frame">
        <ul>
          {events.slice(0, 4).map((event) => {
            return (
              <li>
                <img className="sliderImg" src={event.imageUrl} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Slider;


