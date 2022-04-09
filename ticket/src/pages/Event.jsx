import React from 'react';
import Footer from "../components/Common/Footer";
import Loader from '../components/Common/Loader';
import EventDetail from '../components/Event/EventDetail';
import MainBanner from '../components/Event/MainBanner';
import NotFound from '../components/Event/NotFound';
import { getEventDetail } from '../redux/services';
import GoTop from '../components/Shared/GoTop';

class Event extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { event_id } } } = this.props;
        this.state = {
            event_id: event_id,
            loading: false,
            event: null,
        }
    }

    componentDidMount() {
        const { event_id } = this.state;
        this.setState({ loading: true });
        getEventDetail(event_id)
            .then(({ data }) => {
                const { success, event } = data;
                if (success) {
                    this.setState({ event: event, loading: false });
                } else {
                    this.setState({ event: null, loading: false });
                }
            })
            .catch(() => {
                this.setState({ event: null, loading: false });
            })
    }

    render() {
        const { event, loading } = this.state;

        return (
            <React.Fragment>
                <MainBanner title={loading ? 'Loading ...' : (
                    event ? event.name : 'Event Not Found'
                )} />
                {loading && <div className="container my-5 py-5">
                    <Loader />
                </div>}
                {!loading && !event && <NotFound />}
                {event && <EventDetail event={event} />}
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Event;