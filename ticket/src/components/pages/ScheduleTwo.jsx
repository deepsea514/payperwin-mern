import React from 'react'
import MainBanner from '../schedule/MainBanner';
import EventSchedulesTwo from '../schedule/EventSchedulesTwo';
import Footer from '../Common/Footer';
 
class ScheduleTwo extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <EventSchedulesTwo />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default ScheduleTwo;