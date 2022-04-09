import React from 'react';
import MainBanner from '../components/Events/MainBanner';
import GoTop from '../components/Shared/GoTop';
import SearchForm from '../components//Events/SearchForm';
import EventList from '../components/Events/EventList';
import Footer from "../components/Common/Footer";
import { getEvents } from '../redux/services';
import { scrollToTop } from '../lib/scrollToTop';

class Events extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            page: 1,
            total: 0,
            events: [],
            filter: {}
        }
    }

    initializeFilter = (filter) => {
        this.setState({ filter }, this.loadEvents);
    }

    loadEvents = (page = 1) => {
        const { filter } = this.state;
        scrollToTop();
        this.setState({ loading: true });
        getEvents(filter, page)
            .then(({ data }) => {
                const { success, events, total, page } = data;
                if (success) {
                    this.setState({
                        loading: false,
                        page: page,
                        total: total,
                        events: events
                    });
                } else {
                    this.setState({
                        loading: false,
                        page: 1,
                        total: 0,
                        events: []
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    page: 1,
                    total: 0,
                    events: []
                });
            })
    }

    render() {
        const { loading, page, total, events } = this.state;
        return (
            <React.Fragment>
                <MainBanner />
                <SearchForm initializeFilter={this.initializeFilter} />
                <EventList loading={loading}
                    page={page}
                    total={total}
                    events={events}
                    loadEvents={this.loadEvents}
                />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Events;