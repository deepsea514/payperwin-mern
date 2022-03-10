import React from 'react'
import MainBanner from '../schedule/MainBanner';
import EventSchedulesOne from '../schedule/EventSchedulesOne';
import Footer from '../Common/Footer';
 
class ScheduleOne extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <EventSchedulesOne />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default ScheduleOne;