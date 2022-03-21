import React from 'react';
import lax from 'lax.js';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Venues/MainBanner';
import GoTop from '../components/Shared/GoTop';
import SearchForm from '../components/Venues/SearchForm';
import { scrollToTop } from '../lib/scrollToTop';
import { getVenues } from '../redux/services';

class Venues extends React.Component {
    constructor(props) {
        super(props)
        lax.setup()

        document.addEventListener('scroll', function (x) {
            lax.update(window.scrollY)
        }, false)

        lax.update(window.scrollY)

        this.state = {
            loading: false,
            page: 1,
            total: 0,
            venues: [],
            filter: {}
        }
    }
    initializeFilter = (filter) => {
        this.setState({ filter }, this.loadVenues);
    }

    loadVenues = (page = 1) => {
        const { filter } = this.state;
        scrollToTop();
        getVenues(filter)
    }

    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <SearchForm initializeFilter={this.initializeFilter} />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Venues;