import { useState, useEffect } from "react";
import fetchEvents from "../functions/fetchEvents";
import 'animate.css/animate.min.css';


const Slider = () => {
  const [events, setEvents] = useState([]);
  const [centerIndex, setCenterIndex] = useState(1);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex(prevIndex => (prevIndex + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="slick-slider">
      <div className="slick-list">
        <ul className="slick-track">
          {events.slice(0, 3).map((_, index) => {
            const adjustedIndex = (centerIndex + index - 1 + events.length) % events.length;
            const eventToShow = events[adjustedIndex];
            return (
              <li key={eventToShow.id} className={index === 1 ? "slick-slide center animate__animated animate__fadeIn" : "slick-slide animate__animated animate__fadeIn"}>
                <img className="sliderImg" src={eventToShow.imageUrl} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Slider;
