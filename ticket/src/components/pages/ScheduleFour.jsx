import React from 'react'
import MainBanner from '../schedule/MainBanner';
import EventSchedulesFour from '../schedule/EventSchedulesFour';
import Footer from '../Common/Footer';
 
class ScheduleFour extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <EventSchedulesFour />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default ScheduleFour;