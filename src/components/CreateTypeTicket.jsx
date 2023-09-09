import { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularProgress from '@mui/material/CircularProgress';

function CreateTypeTicket({ eventId, onTypeTicketCreated }) {

    const [typeTicketData, setTypeTicketData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (typeTicket) => {
        const { name, value } = typeTicket.target;

        if (name === 'priceTT' || name === 'quantityTT') {
            const regex = /^[0-9]*$/;
            if (!(regex.test(value) || value === "")) {
                return;
            }
        }

        setTypeTicketData((prevData) => ({
            ...prevData,
            [name]: value.toUpperCase()
        }));
    };

    const handleSubmit = async (typeTicket) => {
        typeTicket.preventDefault();

        const createTypeTicketInput = {
            id: uuid(),
            nameTT: typeTicketData.nameTT,
            priceTT: parseInt(typeTicketData.priceTT),
            quantityTT: parseInt(typeTicketData.quantityTT),
            descriptionTT: typeTicketData.descriptionTT,
            activeTT: Boolean(true),
            startDateTT: new Date(typeTicketData.startDateTT),
            endDateTT: new Date(typeTicketData.endDateTT),
            eventID: eventId
        };

        setLoading(true);

        try {
            await axios.post('https://6yncwz3d23b2iyt337sa4trgsy0deldh.lambda-url.us-east-1.on.aws/', JSON.stringify({ createTypeTicketInput: createTypeTicketInput }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        if (onTypeTicketCreated) {
            onTypeTicketCreated(createTypeTicketInput);
        }
        setTypeTicketData({
            nameTT: "",
            priceTT: "",
            quantityTT: "",
            descriptionTT: "",
            activeTT: false,
            startDateTT: "",
            endDateTT: "",
        });
    };

    if (loading) {
        return (
            <div className="circular-progress">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="type-ticket-form">
                <div className="type-ticket-input">
                    <div>
                        <input
                            type="text"
                            name="nameTT"
                            className="event-input"
                            id="nameTT"
                            value={typeTicketData.nameTT}
                            placeholder="NOMBRE*"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="int"
                            name="priceTT"
                            className="event-input"
                            id="priceTT"
                            value={typeTicketData.priceTT}
                            placeholder="MONTO*"
                            inputMode="numeric"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="int"
                            name="quantityTT"
                            className="event-input"
                            id="quantityTT"
                            value={typeTicketData.quantityTT}
                            placeholder="CANTIDAD*"
                            inputMode="numeric"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <br />
                <br />
                <div>
                    <div>
                        <button type="submit" className="btnMain"> Agregar Ticket </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateTypeTicket;