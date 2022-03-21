import React from 'react';
import CustomGoogleMap from '../Common/CustomGoogleMap';
import { connect } from 'react-redux';
import { getCountryName } from '../../lib/getCountryName';
import EventList from '../Events/EventList';
import { getEvents } from '../../redux/services';

class VenueDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            total: 0,
            page: 1,
            events: [],
        }
    }

    componentDidMount() {
        this.loadEvents();
    }

    loadEvents = (page = 1) => {
        const { venue } = this.props;
        this.setState({ loading: true });
        getEvents({ venue: venue.slug }, page)
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
        const { venue } = this.props;
        const { loading, total, page, events } = this.state;

        return (
            <section className="blog-details-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="blog-details">
                                <h2>{venue.name}</h2>
                                <ul className='event-info mt-3'>
                                    <li><i className="icofont-chart-growth"></i>  Popularity Score: {venue.popularity_score}</li>
                                </ul>

                                <div className="row mt-4">
                                    <div className="col-lg-12">
                                        <h5>Upcoming Events</h5>
                                        <EventList loading={loading}
                                            total={total}
                                            page={page}
                                            events={events}
                                            noEventMessage={'There is No Upcoming Events in this Venue.'}
                                            loadEvents={this.loadEvents}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <div className="sidebar">
                                <div className="widget widget_categories">
                                    <h3 className="widget-title">
                                        Venue Information
                                    </h3>

                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <th>Name:</th>
                                                <td className='text-right'>{venue.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Country:</th>
                                                <td className='text-right'>{getCountryName(venue.country_code)}</td>
                                            </tr>
                                            <tr>
                                                <th>Location:</th>
                                                <td className='text-right'>{venue.location}</td>
                                            </tr>
                                            <tr>
                                                <th>Street:</th>
                                                <td className='text-right'>{venue.address.street_address}</td>
                                            </tr>
                                            <tr>
                                                <th>Postal Code:</th>
                                                <td className='text-right'>{venue.address.postal_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {venue.address.longitude && venue.address.latitude &&
                                    <div className="widget widget_categories">
                                        <CustomGoogleMap
                                            containerElement={<div style={{ height: `50vh` }} />}
                                            longitude={venue.address.longitude}
                                            latitude={venue.address.latitude}
                                        />
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>

            </section >
        );
    }
}

const mapStateToProps = (state) => ({
    cad_rate: state.cad_rate,
});
export default connect(mapStateToProps, null)(VenueDetail);