import React, { useState } from "react";
import Modal from "react-modal";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

Modal.setAppElement("#root");

const LinkEventModal = ({ onEventLinked }) => {

    const { user } = useAuth0();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [eventId, setEventId] = useState("");

    const handleChange = (e) => {
        setEventId(e.target.value);
    };

    const handleModalSubmit = async (eventId) => {

        const rrppEventInput = {
            id: uuid(),
            rrppID: user.sub,
            eventID: eventId
        };

        try {
            const response = await axios.post('https://gmq4wjgi4ajfxd5dg7rqitkixy0wxmxh.lambda-url.us-east-1.on.aws/', JSON.stringify({ rrppEventInput: rrppEventInput }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                onEventLinked();
            }
            console.log(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleModalSubmit(eventId);
        setModalIsOpen(false);
    };

    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <button type="button" class="btnMain" onClick={() => setModalIsOpen(true)}>Unirme a Evento</button>
            </div>
            <Modal
                className="custom-modal"
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Input Modal"
            >
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            className="form-control"
                            type="text"
                            id="eventId"
                            name="eventId"
                            value={eventId}
                            onChange={handleChange}
                            placeholder="CÓDIGO DE EVENTO"
                            required
                        />
                    </div>
                    <br />
                    <div class="btn-container">
                        <button type="button" class="btn-Modal-Back" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        <button className="btn-Modal-Buy" type="submit" disabled={!eventId}>Unirme a Evento</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LinkEventModal;
