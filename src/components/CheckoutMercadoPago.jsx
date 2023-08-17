import axios from "axios";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { createPayment } from "../graphql/mutations";

async function handleCheckoutMP(data, path, cart, eventData) {

    const name = data.name;
    const surname = data.surname;
    const email = data.email;
    const dni = data.dni;

    const cartJson = JSON.stringify(cart);
    const dataJson = JSON.stringify(data);
    const eventDataJson = JSON.stringify(eventData);
    const paymentId = uuid();
    const updatedPrice = 100;

    const createPaymentInput = {
        id: paymentId,
        cart: cartJson,
        paymentStatus: 'PENDING',
        userEmail: data.email,
        amount: updatedPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: dataJson,
        eventData: eventDataJson,
        eventID: eventData.id,
    };

    await API.graphql(graphqlOperation(createPayment, { input: createPaymentInput }))

    try {
        const result = await axios.post('https://hs37nkozzmf2277yidvtyqowsa0enots.lambda-url.us-east-1.on.aws/', {
            name, surname, email, dni, cart, eventData, path, paymentId
        });
        console.log('Checkout done', result);
        const preferenceId = result.data.id;
        redirectToMercadoPago(preferenceId);
    } catch (error) {
        console.error('Failed to checkout', error);
    }

    function redirectToMercadoPago(preference) {
        const url = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preference}`;
        window.open(url, '_blank');
    }
};

export default handleCheckoutMP;