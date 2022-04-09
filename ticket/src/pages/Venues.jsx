import React from 'react';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Venues/MainBanner';
import GoTop from '../components/Shared/GoTop';
import VenueList from '../components/Venues/VenueList';
import SearchForm from '../components/Venues/SearchForm';
import { scrollToTop } from '../lib/scrollToTop';
import { getVenues } from '../redux/services';

class Venues extends React.Component {
    constructor(props) {
        super(props)
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
        this.setState({ loading: true })
        getVenues(filter, page)
            .then(({ data }) => {
                const { success, venues, total, page } = data;
                if (success) {
                    this.setState({
                        loading: false,
                        page: page,
                        total: total,
                        venues: venues
                    });
                } else {
                    this.setState({
                        loading: false,
                        page: 1,
                        total: 0,
                        venues: []
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    page: 1,
                    total: 0,
                    venues: []
                });
            })
    }

    render() {
        const { loading, page, total, venues } = this.state;
        return (
            <React.Fragment>
                <MainBanner />
                <SearchForm initializeFilter={this.initializeFilter} />
                <VenueList loading={loading}
                    page={page}
                    total={total}
                    venues={venues}
                    loadVenues={this.loadVenues} />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Venues;