import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../graphql/queries";
import CircularProgress from '@mui/material/CircularProgress';

const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';


const fetchEvents = async (userId) => {
    try {
        const eventsData = await API.graphql(graphqlOperation(listEvents));
        const eventsList = eventsData.data.listEvents.items;

        //SI PASO USER ID COMO PARÁMETRO, FILTRO LOS EVENTOS POR ESE USER ID
        const filteredEvents = userId ? eventsList.filter(event => event.userID === userId) : eventsList;

        const eventsWithImages = await Promise.all(
            filteredEvents.map(async (event) => {
                const imagePath = `${event.flyerMiniEvent}`;
                const imageUrl = `${cloudFrontUrl}/${imagePath}`;
                event.imageUrl = imageUrl;
                return event;
            })
        );
        return eventsWithImages;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }

};

export default fetchEvents;
