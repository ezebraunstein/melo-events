import { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


function CreateTypeTicket({ eventId, onTypeTicketCreated }) {

    const [typeTicketData, setTypeTicketData] = useState({});

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

    // const handleInputChangeBool = (typeTicket) => {
    //     const { name, value, type, checked } = typeTicket.target;
    //     const inputValue = type === "checkbox" ? checked : value;
    //     setTypeTicketData((prevData) => ({
    //         ...prevData,
    //         [name]: inputValue
    //     }));
    // };

    //

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
        debugger;
        try {
            const response = await axios.post('https://6yncwz3d23b2iyt337sa4trgsy0deldh.lambda-url.us-east-1.on.aws/', JSON.stringify({ createTypeTicketInput: createTypeTicketInput }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.log(error);
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

    return (
        <div>
            <form onSubmit={handleSubmit} className="create-type-ticket-form">
                <div className="inputs-container">
                    <div className="col">
                        <input
                            type="text"
                            name="nameTT"
                            className="form-control"
                            id="nameTT"
                            value={typeTicketData.nameTT}
                            placeholder="NOMBRE TIPO TICKET*"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <div className="col">
                        <input
                            type="int"
                            name="priceTT"
                            className="form-control"
                            id="priceTT"
                            value={typeTicketData.priceTT}
                            placeholder="MONTO*"
                            inputMode="numeric"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <div className="col">
                        <input
                            type="int"
                            name="quantityTT"
                            className="form-control"
                            id="quantityTT"
                            value={typeTicketData.quantityTT}
                            placeholder="CANTIDAD DISPONIBLE*"
                            inputMode="numeric"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <br />
                <br />
                <div>
                    <div className="col-sm-12 text-center">
                        <button type="submit" className="btnMain"> Agregar Ticket </button>
                    </div>
                </div>
                <br />
                <br />
            </form>
        </div>
    );
};

export default CreateTypeTicket;