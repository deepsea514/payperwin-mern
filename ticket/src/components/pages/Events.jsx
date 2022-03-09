import React from 'react';
import MainBanner from '../Events/MainBanner';
import GoTop from '../Shared/GoTop';
import Footer from '../Common/Footer';
import lax from 'lax.js';
import SearchForm from '../Events/SearchForm';

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
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Events;