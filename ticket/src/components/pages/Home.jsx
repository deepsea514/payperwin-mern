import React from 'react';
import MainBanner from '../Home/MainBanner';
import TopPlaces from '../Home/TopPlaces';
import GoTop from '../Shared/GoTop';
import Footer from '../Common/Footer';
import EventSchedules from '../Home/EventSchedules';
import FunFact from '../Common/FunFact';
import lax from 'lax.js';
import BuyTicket from '../Common/BuyTicket';
import Popular from '../Home/Popular';
 
class Home extends React.Component {
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
                <MainBanner />
                <Popular />
                <TopPlaces />
                <EventSchedules />
                <FunFact />
                <BuyTicket />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}
 
export default Home;