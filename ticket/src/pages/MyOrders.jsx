import React from 'react';
import lax from 'lax.js';
import GoTop from '../components/Shared/GoTop';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Orders/MainBanner';
import OrderList from '../components/Orders/OrderList';

class MyOrders extends React.Component {
    constructor(props) {
        super(props)
        lax.setup()

        document.addEventListener('scroll', function (x) {
            lax.update(window.scrollY)
        }, false)

        lax.update(window.scrollY)
    }
    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <OrderList />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default MyOrders;