import React from 'react';
// import CustomGoogleMap from '../Common/CustomGoogleMap';
import { connect } from 'react-redux';

class VenueDetail extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // const { event } = props;

    // }

    render() {
        const { venue } = this.props;

        return (
            <section className="blog-details-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="blog-details">
                                <h2>{venue.name}</h2>
                                {/* <ul className='event-info mt-3'>
                                    <li><i className="icofont-field"></i> <Link to={"/venues/" + event.venue.slug}><span>{event.venue.name}</span></Link></li>
                                    <li>
                                        <i className="icofont-location-pin"></i>&nbsp;
                                        {event.venue.address.street_address},&nbsp;
                                        {event.venue.location},&nbsp;
                                        {getCountryName(event.venue.country_code)}&nbsp;
                                        {event.venue &&
                                            event.venue.address.longitude &&
                                            event.venue.address.latitude &&
                                            <span role="button"
                                                onClick={() => this.setState({ showMapModal: true })}>(View Map)</span>}
                                    </li>
                                    <li><i className="icofont-wall-clock"></i> {dateformat(event.occurs_at, 'ddd mmm dd yyyy HH:MM')}</li>
                                </ul> */}
                            </div>

                            <div className='event-seatmap mt-4' id='event-seatmap'></div>
                        </div>

                        <div className="col-lg-4">
                            <div className="sidebar">

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