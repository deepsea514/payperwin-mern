import React from 'react';
import lax from 'lax.js';
import MainBanner from '../HomeThree/MainBanner';
import About from '../HomeThree/About';
import WhyUs from '../HomeThree/WhyUs';
import Speakers from '../HomeThree/Speakers';
import EventSchedules from '../HomeThree/EventSchedules';
import FunFact from '../Common/FunFact';
import Pricing from '../HomeThree/Pricing';
import Partner from '../Common/Partner';
import LatesNews from '../HomeThree/LatestNews';
import BuyTicket from '../Common/BuyTicket';
import Subscribe from '../Common/Subscribe';
import Footer from '../Common/Footer';
import GoTop from '../Shared/GoTop';
import Cta from '../Common/Cta';
 
class HomeThree extends React.Component {
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
                <Cta />
                {/* Speakers Area */}
                <Speakers />
                {/* Schedule Area */}
                <EventSchedules />
                {/* FunFacts Area */}
                <FunFact />
                {/* Pricing Area */}
                <Pricing />
                {/* Partner Area */}
                <Partner />
                {/* Blog Area */}
                <LatesNews />
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
 
export default HomeThree;