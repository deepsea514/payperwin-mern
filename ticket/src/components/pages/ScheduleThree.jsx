import React from 'react'
import MainBanner from '../schedule/MainBanner';
import EventSchedulesThree from '../schedule/EventSchedulesThree';
import Footer from '../Common/Footer';
 
class ScheduleThree extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <EventSchedulesThree />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default ScheduleThree;