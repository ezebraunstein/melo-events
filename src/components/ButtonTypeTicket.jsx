import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateTypeTicket } from '../graphql/mutations';
import IOSSwitch from './IOSSwitch';

const ButtonTypeTicket = ({ typeTicketId, isActive, onTypeTicketToggled }) => {
    const [isActiveLocal, setIsActiveLocal] = useState(isActive);

    const toggleActive = async () => {

        const newIsActiveStatus = !isActiveLocal;

        setIsActiveLocal(newIsActiveStatus);
        onTypeTicketToggled(typeTicketId, newIsActiveStatus);

        try {
            await API.graphql(graphqlOperation(updateTypeTicket, {
                input: {
                    id: typeTicketId,
                    activeTT: newIsActiveStatus
                }
            }));
        } catch (error) {
            console.error("Error updating activeTT:", error);
            setIsActiveLocal(isActive);
            onTypeTicketToggled(typeTicketId, isActive);
        }
    };

    return (
        <IOSSwitch checked={isActiveLocal} onChange={toggleActive} />
    );
};

export default ButtonTypeTicket;
