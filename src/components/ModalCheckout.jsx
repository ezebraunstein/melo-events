import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const InputModal = ({ handleModalSubmit, cart }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email1: "",
        email2: "",
        dni: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleModalSubmit(formData);
        setModalIsOpen(false);
    };

    return (
        <div>
            <button type="button" class="btnMain" disabled={!cart.length} onClick={() => setModalIsOpen(true)}>Comprar</button>
            <Modal
                className="custom-modal"
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Input Modal"
            >

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            class="form-control"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                        />
                    </div>
                    <div>
                        <input
                            class="form-control"
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Apellido"
                            required
                        />
                    </div>
                    <div>
                        <input
                            class="form-control"
                            type="email"
                            id="email"
                            name="email1"
                            value={formData.email1}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            class="form-control"
                            style={{ color: formData.email1 === formData.email2 ? 'black' : 'red' }}
                            type="email"
                            id="email"
                            name="email2"
                            value={formData.email2}
                            onChange={handleChange}
                            placeholder="Repite tu email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            class="form-control"
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={(e) => {
                                const regex = /^[0-9]*$/;
                                if (regex.test(e.target.value) || e.target.value === "") {
                                    handleChange(e);
                                }
                            }}
                            placeholder="DNI"
                            required
                            pattern="\d{8}"
                            maxLength="8"
                            minLength="8"
                            inputMode="numeric"
                        />
                    </div>
                    <br />
                    <div class="btn-container">
                        <button type="button" class="btn-Modal-Back" onClick={() => setModalIsOpen(false)}>Volver Atrás</button>
                        <button class="btn-Modal-Buy" type="submit" disabled={!formData.email1 || !formData.email2 || formData.email1 !== formData.email2 || !formData.dni || !formData.name || !formData.surname}>Continuar con el pago</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InputModal;
