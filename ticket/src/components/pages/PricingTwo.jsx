import React from 'react';
import MainBanner from '../Pricing/MainBanner';
import PricingCardTwo from '../Pricing/PricingCardTwo';
import Footer from '../Common/Footer';
 
class ProcingTwo extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <PricingCardTwo />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default ProcingTwo;