import React from 'react';
import MainBanner from '../AboutOne/MainBanner';
import About from '../AboutOne/About';
import WhyUs from '../Common/WhyUs';
import Speakers from '../AboutOne/Speakers';
import GoTop from '../Shared/GoTop';
import Footer from '../Common/Footer';
import FunFact from '../Common/FunFact';
import lax from 'lax.js';
import Partner from '../Common/Partner';
import BuyTicket from '../Common/BuyTicket';
import Subscribe from '../Common/Subscribe';
import Cta from '../Common/Cta';
 
class AboutOne extends React.Component {
    constructor(props) {
        super(props)
        lax.setup()
    
        document.addEventListener('scroll', function(x) {
            lax.update(window.scrollY)
        }, false)
    
        lax.update(window.scrollY)
    }
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
                {/* CTA Are */}
                <Cta />
                {/* FunFacts Area */}
                <FunFact />
                {/* Pricing Area */}
                <Partner />
                {/* Buy Tickets Area */}
                <BuyTicket />
                {/* Subscribe Area */}
                <Subscribe />

                <Footer />

                {/* Back Top top */}
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}
 
export default AboutOne;