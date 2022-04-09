import React from 'react';
import GoTop from '../components/Shared/GoTop';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Checkout/MainBanner';
import CartDetail from '../components/Checkout/CartDetail';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_WmbjeQFOTJM5Sb5PQvYXBM07");

class Checkout extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <CartDetail />
                <Elements stripe={stripePromise}>
                    <ElementsConsumer>
                        {(ctx) => <CheckoutForm {...ctx} />}
                    </ElementsConsumer>
                </Elements>
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Checkout;