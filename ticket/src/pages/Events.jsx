import React from 'react';
import lax from 'lax.js';
import MainBanner from '../components/Events/MainBanner';
import GoTop from '../components/Shared/GoTop';
import SearchForm from '../components//Events/SearchForm';
import EventList from '../components/Events/EventList';
import Footer from "../components/Common/Footer";

class Events extends React.Component {
    constructor(props) {
        super(props)
        lax.setup()

        document.addEventListener('scroll', function (x) {
            lax.update(window.scrollY)
        }, false)

        lax.update(window.scrollY)
    }
    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <SearchForm />
                <EventList />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Events;