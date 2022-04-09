import React from 'react';
import GoTop from '../components/Shared/GoTop';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Orders/MainBanner';
import OrderList from '../components/Orders/OrderList';

class MyOrders extends React.Component {
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