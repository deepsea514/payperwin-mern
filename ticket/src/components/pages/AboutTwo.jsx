import React from 'react'
import MainBanner from '../AboutTwo/MainBanner';
import About from '../AboutTwo/About';
import WhyUs from '../AboutTwo/WhyUs';
import Speakers from '../AboutTwo/Speakers';
import Partner from '../Common/Partner';
import BuyTicket from '../Common/BuyTicket';
import Subscribe from '../Common/Subscribe';
import Footer from '../Common/Footer';
import GoTop from '../Shared/GoTop';
import Cta from '../Common/Cta';
 
class AboutTwo extends React.Component {
    render(){
        return (
            <React.Fragment>
                {/* Main Banner */}
                <MainBanner />
                {/* About Area */}
                <About />
                {/* Why Choose Us Area */}
                <WhyUs />
                <Cta />
                {/* Speakers Area */}
                <Speakers />
                {/* Partner Area */}
                <Partner />
                {/* Buy Tickets Area */}
                <BuyTicket />
                {/* Subscribe Area */}
                <Subscribe />
                {/* Footer Area */}
                <Footer />
                {/* Back Top top */}
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}
 
export default AboutTwo;