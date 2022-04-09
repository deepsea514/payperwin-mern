import React from 'react';
import { Link } from 'react-router-dom';
import { getCountryName } from '../../lib/getCountryName';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class VenueList extends React.Component {
    render() {
        const { loading, page, total, venues, loadVenues } = this.props;

        if (loading) {
            return (
                <div className="container mb-5 mt-3">
                    <Loader />
                </div>
            )
        }
        if (!venues || venues.length === 0) {
            return (
                <div className="container my-5">
                    <h3 className='text-center'>There is No Venues. Please try again with other search terms.</h3>
                </div>
            )
        }

        return (
            <div className="container mb-5">
                <div className='tab_content'>
                    <div className="tabs_item">
                        <ul className="accordion">
                            {venues.map((venue, index) => (
                                <li className="accordion-item" key={index}>
                                    <div className="accordion-title">
                                        <div className="schedule-info">
                                            <h3>{venue.name}</h3>

                                            <ul>
                                                <li><i className="icofont-location-pin"></i> <span>{venue.address.street_address}, {venue.address.locality}, {venue.address.region}, {getCountryName(venue.address.country_code)}</span></li>
                                                <li><i className="icofont-chart-growth"></i> Popularity Score: {venue.popularity_score}</li>
                                            </ul>
                                            {/* {venue.performances && venue.performances.length && <ul>
                                                <li>
                                                    <i className="icofont-users-alt-4"></i>&nbsp;
                                                    {venue.performances.map((performer, index) => (
                                                        <React.Fragment key={index}>
                                                            <Link to={"/performers/" + performer.performer.slug}>{performer.performer.name}</Link>{(index === venue.performances.length - 1) ? '' : ', '}
                                                        </React.Fragment>
                                                    ))}
                                                </li>
                                            </ul>} */}
                                            {/* <div className='mt-2 tagcloud'>
                                                {venue.categories.map((category, index) => (
                                                    <Link key={index} to={"/categories/" + category.slug}>{category.name}</Link>
                                                ))}
                                            </div> */}
                                        </div>
                                        <Link to={venue.slug_url} className='btn btn-secondary btn-buy'>See Detail</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <CustomPagination onChangePage={loadVenues}
                    total={total}
                    currentPage={page - 1} />
            </div>
        );
    }
}

export default VenueList;