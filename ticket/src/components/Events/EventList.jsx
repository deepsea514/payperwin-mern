import React from 'react';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class EventList extends React.Component {
    render() {
        const { loading, page, total, events, loadEvents, noEventMessage } = this.props;

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
                    <h3 className='text-center'>
                        {noEventMessage ? noEventMessage : 'There is No Events. Please try again with other search terms.'}
                    </h3>
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
                                                <li><i className="icofont-field"></i> At <Link to={"/venues/" + event.venue.slug}><span>{event.venue.name}</span></Link> in {event.venue.location}</li>
                                                <li><i className="icofont-wall-clock"></i> {dateformat(event.occurs_at, 'ddd mmm dd yyyy HH:MM')}</li>
                                                {event.performances && event.performances.length && <li>
                                                    <i className="icofont-users-alt-4"></i>&nbsp;
                                                    {event.performances.map((performer, index) => (
                                                        <React.Fragment key={index}>
                                                            <Link to={"/performers/" + performer.performer.slug}>{performer.performer.name}</Link>{(index === event.performances.length - 1) ? '' : ', '}
                                                        </React.Fragment>
                                                    ))}
                                                </li>}
                                            </ul>
                                            <div className='mt-2 tagcloud'>
                                                {event.categories.map((category, index) => (
                                                    <Link key={index} to={"/categories/" + category.slug}>{category.name}</Link>
                                                ))}
                                            </div>
                                        </div>
                                        <Link to={"/event/" + event.id} className='btn btn-secondary btn-buy'>Buy&nbsp;Ticket</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <CustomPagination onChangePage={loadEvents}
                    total={total}
                    currentPage={page - 1} />
            </div>
        );
    }
}

export default EventList;