import React from 'react'
import MainBanner from '../AboutThree/MainBanner';
import About from '../AboutThree/About';
import WhyUs from '../AboutThree/WhyUs';
import Speakers from '../AboutThree/Speakers';
import Partner from '../Common/Partner';
import BuyTicket from '../Common/BuyTicket';
import Subscribe from '../Common/Subscribe';
import Footer from '../Common/Footer';
import GoTop from '../Shared/GoTop';
import Cta from '../Common/Cta';
import FunFact from '../Common/FunFact';
 
class AboutThree extends React.Component {
    render(){
        return (
            <React.Fragment>
                {/* Main Banner */}
                <MainBanner />
                {/* About Area */}
                <About />
                {/* Why Choose Us Area */}
                <WhyUs />
                {/* Speakers Area */}
                <Speakers />
                <Cta />
                <FunFact />
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
 
export default AboutThree;