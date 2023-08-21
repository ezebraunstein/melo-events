import { API, graphqlOperation } from 'aws-amplify';
import { listTypeTickets } from '../graphql/queries';

// const fetchTypeTickets = async (eventId) => {
//     try {
//         const typeTicketsData = await API.graphql(graphqlOperation(listTypeTickets, {
//             filter: { eventID: { eq: eventId } }
//         }));
//         return typeTicketsData.data.listTypeTickets.items;
//     } catch (error) {
//         console.error("Error fetching type tickets:", error);
//         throw error;
//     }
// };

// export default fetchTypeTickets;

const fetchTypeTickets = async (eventId, typeCounts = {}) => {
    try {
        const typeTicketsData = await API.graphql(graphqlOperation(listTypeTickets, { filter: { eventID: { eq: eventId } } }));
        return typeTicketsData.data.listTypeTickets.items.map((typeTicket) => ({
            ...typeTicket,
            count: typeCounts[typeTicket.id] || 0
        }));
    } catch (error) {
        console.error("Error fetching type tickets:", error);
    }
};

export default fetchTypeTickets;
