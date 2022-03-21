import React from 'react';
import { Link } from 'react-router-dom';
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
                                                <li><i className="icofont-location-pin"></i> <span>{venue.address.street_address}, {venue.address.locality}, {venue.address.region}, {venue.address.country_code === 'CA' ? 'Canada' : 'United States'}</span></li>
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

                <div className="shape1">
                    <img src="/images/shapes/1.png" alt="shape1" />
                </div>
                <div className="shape2 rotateme">
                    <img src="/images/shapes/2.png" alt="shape2" />
                </div>
                <div className="shape3 rotateme">
                    <img src="/images/shapes/3.png" alt="shape3" />
                </div>
                <div className="shape4">
                    <img src="/images/shapes/4.png" alt="shape4" />
                </div>
            </div>
        );
    }
}

export default VenueList;