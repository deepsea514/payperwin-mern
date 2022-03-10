import React from 'react';
import lax from 'lax.js';
import MainBanner from '../HomeFour/MainBanner';
import About from '../HomeFour/About';
import WhyUs from '../HomeFour/WhyUs';
import Speakers from '../HomeFour/Speakers';
import EventSchedules from '../HomeFour/EventSchedules';
import FunFact from '../Common/FunFact';
import Pricing from '../HomeFour/Pricing';
import Partner from '../Common/Partner';
import LatesNews from '../HomeFour/LatestNews';
import BuyTicket from '../Common/BuyTicket';
import Subscribe from '../Common/Subscribe';
import Footer from '../Common/Footer';
import GoTop from '../Shared/GoTop';
 
class HomeFour extends React.Component {
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
 
export default HomeFour;