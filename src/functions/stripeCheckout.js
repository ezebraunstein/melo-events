import AWS from 'aws-sdk';
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { createPayment } from '../graphql/mutations';
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';


AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLIC);

async function handleCheckoutStripe(cart, data, eventData) {

    const lineItems = convertCartToLineItems(cart);
    const cartJson = JSON.stringify(cart);
    const emailBuyer = data.email1;
    const dniBuyer = data.dni;
    const eventId = eventData.id;
    const eventName = eventData.nameEvent;
    const paymentId = uuid();
    const updatedPrice = ((lineItems.reduce((acc, item) => acc + (item.price_data.unit_amount * item.quantity), 0)) / 100) * 1.75;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    const createPaymentInput = {
        id: paymentId,
        cart: cartJson,
        paymentStatus: 'PENDING',
        emailBuyer: emailBuyer,
        dniBuyer: dniBuyer,
        amount: updatedPrice,
        eventName: eventName,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        eventID: eventId,
    };

    await API.graphql(graphqlOperation(createPayment, { input: createPaymentInput }))

    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60);

    try {
        const response = await axios.post('https://okosjzzcwklkr22nb5wc3ksmlm0fjcey.lambda-url.us-east-1.on.aws/', {
            line_items: lineItems,
            success_url: `${baseUrl}/compra-exitosa`,
            cancel_url: `${baseUrl}/compra-fallida`,
            email: data.email1,
            payment_id: paymentId,
            event_id: eventId,
            expires_at: expiresAt,
            locale: 'es',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        const stripe = await stripePromise;

        if (!stripe) {
            console.error("Failed to initialize Stripe");
            return;
        }

        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });

    } catch (error) {
        console.error("Error redirecting to checkout:", error);
    }

    function convertCartToLineItems() {
        const items = cart.map((item) => {
            const updatedPrice = item.priceTT / 1.75
            return {
                price_data: {
                    currency: 'ars',
                    product_data: {
                        name: item.nameTT,
                    },
                    unit_amount: Math.round(updatedPrice * 100),
                },
                quantity: item.selectedQuantity,
            };
        });

        const totalAmount = (items.reduce((acc, item) => acc + (item.price_data.unit_amount * item.quantity), 0));
        const feeAmount = Math.round(totalAmount * 0.15);

        const feeItem = {
            price_data: {
                currency: 'ars',
                product_data: {
                    name: 'Cargo por servicio 15%',
                },
                unit_amount: feeAmount,
            },
            quantity: 1,
        };

        items.push(feeItem);
        return items;
    }

}

export default handleCheckoutStripe;

