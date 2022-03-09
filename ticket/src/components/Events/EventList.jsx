import React from 'react';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomPagination from '../Common/CustomPagination';

class EventList extends React.Component {
    render() {
        return (
            <div className="container mb-5">
                <div className='tab_content'>
                    <div className="tabs_item">
                        <ul className="accordion">
                            {Array(16).fill(1).map((item, index) => (
                                <li className="accordion-item" key={index}>
                                    <div className="accordion-title">
                                        <div className="schedule-info">
                                            <h3>San Jose Sharks at Chicago Blackhawks</h3>

                                            <ul>
                                                <li><i className="icofont-location-pin"></i> At <span>Max Bell Arena</span> in Calgary, AB</li>
                                                <li><i className="icofont-wall-clock"></i> {dateformat('2022-04-12T19:30:00.000+00:00', 'ddd mmm dd yyyy HH:MM')}</li>
                                            </ul>
                                            <ul className='mt-2'>
                                                <li><i className="icofont-tags" /> <Link to="#">SPORTS</Link>, <Link to="#">ICE HOCKEY</Link>, <Link to="#">NHL</Link></li>
                                            </ul>
                                        </div>
                                        <button className='btn btn-secondary btn-buy'>Buy Ticket</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <CustomPagination onChangePage={(page) => { }}
                    totalPages={10}
                    currentPage={2} />

                <div className='row'>
                    <div className="col-lg-12">
                        <div className="btn-box">
                            <Link to="#" className="btn btn-primary">Download List (PDF)</Link>
                        </div>
                    </div>
                </div>

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