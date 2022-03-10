import React from 'react';
import MainBanner from '../Pricing/MainBanner';
import PricingCardOne from '../Pricing/PricingCardOne';
import Footer from '../Common/Footer';
 
class PricingOne extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <PricingCardOne />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default PricingOne;