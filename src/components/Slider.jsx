import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../graphql/queries";
import { useState, useEffect } from "react";


const Slider = () => {

  //CLOUDFRONT URL

  const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {

    try {

      const eventsData = await API.graphql(graphqlOperation(listEvents));
      const eventsList = eventsData.data.listEvents.items;
      const eventsWithImages = await Promise.all(

        eventsList.map(async (event) => {
          const imagePath = `${event.flyerEvent}`;
          const imageUrl = `${cloudFrontUrl}/${imagePath}`;
          event.imageUrl = imageUrl;
          return event;
        })
      );
      setEvents(eventsWithImages.slice(-4));
    } catch (error) {
      console.log("", error);
    }
  };

  useEffect(() => {
    fetchEvents();
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


