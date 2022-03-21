import React from 'react';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class EventList extends React.Component {
    render() {
        const { loading, page, total, events, loadEvents } = this.props;

        if (loading) {
            return (
                <div className="container mb-5 mt-3">
                    <Loader />
                </div>
            )
        }
        if (!events || events.length === 0) {
            return (
                <div className="container my-5">
                    <h3 className='text-center'>There is No Events. Please try again with other search terms.</h3>
                </div>
            )
        }

        return (
            <div className="container mb-5">
                <div className='tab_content'>
                    <div className="tabs_item">
                        <ul className="accordion">
                            {events.map((event, index) => (
                                <li className="accordion-item" key={index}>
                                    <div className="accordion-title">
                                        <div className="schedule-info">
                                            <h3>{event.name}</h3>

                                            <ul>
                                                <li><i className="icofont-location-pin"></i> At <Link to={"/venues/" + event.venue.slug}><span>{event.venue.name}</span></Link> in {event.venue.location}</li>
                                                <li><i className="icofont-wall-clock"></i> {dateformat(event.occurs_at, 'ddd mmm dd yyyy HH:MM')}</li>
                                            </ul>
                                            {event.performances && event.performances.length && <ul>
                                                <li>
                                                    <i className="icofont-users-alt-4"></i>&nbsp;
                                                    {event.performances.map((performer, index) => (
                                                        <React.Fragment key={index}>
                                                            <Link to={"/performers/" + performer.performer.slug}>{performer.performer.name}</Link>{(index === event.performances.length - 1) ? '' : ', '}
                                                        </React.Fragment>
                                                    ))}
                                                </li>
                                            </ul>}
                                            <div className='mt-2 tagcloud'>
                                                {event.categories.map((category, index) => (
                                                    <Link key={index} to={"/categories/" + category.slug}>{category.name}</Link>
                                                ))}
                                            </div>
                                        </div>
                                        <Link to={"/event/" + event.id} className='btn btn-secondary btn-buy'>Buy Ticket</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <CustomPagination onChangePage={loadEvents}
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

export default EventList;