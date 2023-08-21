import { API, graphqlOperation } from 'aws-amplify';
import { getEvent } from '../graphql/queries';

const cloudFrontUrl = 'https://dx597v8ovxj0u.cloudfront.net';

const fetchEventData = async (eventId) => {
    try {
        const eventResult = await API.graphql(
            graphqlOperation(getEvent, { id: eventId })
        );
        const event = eventResult.data.getEvent;
        const imagePath = `${event.flyerMiniEvent}`;
        const imageUrl = `${cloudFrontUrl}/${imagePath}`;
        event.imageUrl = imageUrl;
        return event;
    } catch (error) {
        console.error("Error fetching event:", error);
        throw error;  
    }
};

export default fetchEventData;
