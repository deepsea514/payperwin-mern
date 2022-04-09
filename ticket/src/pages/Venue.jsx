import React from 'react';
import Footer from "../components/Common/Footer";
import Loader from '../components/Common/Loader';
import MainBanner from '../components/Venue/MainBanner';
import NotFound from '../components/Venue/NotFound';
import VenueDetail from '../components/Venue/VenueDetail';
import { getVenueDetail } from '../redux/services';
import GoTop from '../components/Shared/GoTop';

class Venue extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { venue_slug } } } = this.props;
        this.state = {
            venue_slug: venue_slug,
            loading: false,
            venue: null,
        }
    }

    componentDidMount() {
        const { venue_slug } = this.state;
        this.setState({ loading: true });
        getVenueDetail(venue_slug)
            .then(({ data }) => {
                const { success, venue } = data;
                if (success) {
                    this.setState({ venue: venue, loading: false });
                } else {
                    this.setState({ venue: null, loading: false });
                }
            })
            .catch(() => {
                this.setState({ venue: null, loading: false });
            })
    }

    render() {
        const { venue, loading } = this.state;
        return (
            <React.Fragment>
                <MainBanner title={loading ? 'Loading ...' : (
                    venue ? venue.name : 'Venue Not Found'
                )} />
                {loading && <div className="container my-5 py-5">
                    <Loader />
                </div>}
                {!loading && !venue && <NotFound />}
                {venue && <VenueDetail venue={venue} />}
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Venue;