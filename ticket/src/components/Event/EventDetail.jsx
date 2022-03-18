import React from 'react';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomGoogleMap from '../Common/CustomGoogleMap';

class EventDetail extends React.Component {
    render() {
        const { event } = this.props;

        return (
            <section className="blog-details-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="blog-details">
                                <h2>{event.name}</h2>
                                <ul className='event-info mt-3'>
                                    <li><i className="icofont-location-pin"></i> At <Link to={"/venues/" + event.venue.slug}><span>{event.venue.name}</span></Link> in {event.venue.location}</li>
                                    <li><i className="icofont-wall-clock"></i> {dateformat(event.occurs_at, 'ddd mmm dd yyyy HH:MM')}</li>
                                </ul>

                                {event.configuration && event.configuration.seating_chart && event.configuration.seating_chart.large && event.configuration.seating_chart.large !== 'null' &&
                                    < div class="post-image mt-3">
                                        <img src={event.configuration.seating_chart.large} alt="Configuration" />
                                    </div>}
                            </div>

                            {/* <div className="post-tag-media">
                                <div className="row h-100 align-items-center">
                                    <div className="col-lg-6">
                                        <ul className="social-share">
                                            <li><span>Share on:</span></li>
                                            <li><Link to="#"><i className="icofont-facebook"></i></Link></li>
                                            <li><Link to="#"><i className="icofont-twitter"></i></Link></li>
                                            <li><Link to="#"><i className="icofont-instagram"></i></Link></li>
                                            <li><Link to="#"><i className="icofont-linkedin"></i></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div id="comments" className="comments-area mt-4">
                                <h2 className="comments-title">3 Comments</h2>

                                <ol className="comment-list">
                                    <li className="comment mt-2">
                                        <article className="comment-body">
                                            <footer className="comment-meta">
                                                <div className="comment-author vcard">
                                                    <img src="/images/author9.jpg" className="avatar" alt="blog" />
                                                    <b className="fn">John Smith</b>
                                                    <span className="says">says:</span>
                                                </div>

                                                <div className="comment-metadata">
                                                    March 28, 2020 at 7:16 am
                                                </div>
                                            </footer>

                                            <div className="comment-content">
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat Link ante. It is Link long established fact that Link reader will be distracted by the readable content of Link page when looking at its layout.</p>
                                            </div>
                                        </article>
                                    </li>
                                </ol>

                                <div id="respond" className="comment-respond">
                                    <h3 className="comment-reply-title">Leave A Comment</h3>

                                    <form id="commentform" className="comment-form">
                                        <p className="comment-notes">Your email address will not be published.</p>

                                        <p className="comment-form-comment">
                                            <textarea id="comment" placeholder="Comment" cols="45" rows="4" />
                                        </p>
                                        <p className="comment-form-author">
                                            <input id="author" placeholder="Name" type="text" />
                                        </p>
                                        <p className="comment-form-email">
                                            <input id="email" placeholder="Email" type="text" />
                                        </p>
                                        <p className="form-submit">
                                            <button type="submit" id="submit" className="submit">
                                                Post A Comment
                                            </button>
                                        </p>
                                    </form>
                                </div>
                            </div> */}
                        </div>

                        <div className="col-lg-4">
                            <div className="sidebar">
                                {event.venue && event.venue.address.longitude && event.venue.address.latitude &&
                                    <div className="widget widget_categories">
                                        <CustomGoogleMap
                                            longitude={event.venue.address.longitude}
                                            latitude={event.venue.address.latitude}
                                        />
                                    </div>}
                                {event.venue && <div className="widget widget_categories">
                                    <h3 className="widget-title">
                                        Venue
                                    </h3>

                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <th>Name:</th>
                                                <td className='text-right'>{event.venue.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Country:</th>
                                                <td className='text-right'>{event.venue.country_code === 'ca' ? 'Canada' : 'United States'}</td>
                                            </tr>
                                            <tr>
                                                <th>Location:</th>
                                                <td className='text-right'>{event.venue.location}</td>
                                            </tr>
                                            <tr>
                                                <th>Street:</th>
                                                <td className='text-right'>{event.venue.address.street_address}</td>
                                            </tr>
                                            <tr>
                                                <th>Postal Code:</th>
                                                <td className='text-right'>{event.venue.address.postal_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>}
                                {/* <div className="widget widget_categories">
                                    <h3 className="widget-title">
                                        Categories
                                    </h3>

                                    <ul>
                                        {event.categories.map((category, index) => (
                                            <li key={index}><Link to={category.slug_url}>{category.name}</Link></li>
                                        ))}
                                    </ul>
                                </div> */}

                                {/* <div className="widget widget_categories">
                                    <h3 className="widget-title">
                                        Performers
                                    </h3>

                                    <ul>
                                        {event.performances.map((performer, index) => (
                                            <li key={index}><Link to={performer.performer.slug_url}>{performer.performer.name}</Link></li>
                                        ))}
                                    </ul>
                                </div> */}

                                {/* <div className="widget widget_tag_cloud">
                                    <h3 className="widget-title">
                                        Tags
                                    </h3>

                                    <div className="tagcloud">
                                        <Link to="#">Error</Link>
                                        <Link to="#">Cake Bake</Link>
                                        <Link to="#">Dromzone</Link>
                                        <Link to="#">File</Link>
                                        <Link to="#">Yii</Link>
                                        <Link to="#">Yii2</Link>
                                        <Link to="#">UUID</Link>
                                        <Link to="#">Setup</Link>
                                        <Link to="#">Error</Link>
                                        <Link to="#">Cake Bake</Link>
                                        <Link to="#">Dromzone</Link>
                                        <Link to="#">File</Link>
                                        <Link to="#">Yii</Link>
                                        <Link to="#">Yii2</Link>
                                        <Link to="#">UUID</Link>
                                        <Link to="#">Setup</Link>
                                    </div>
                                </div> */}

                                {/* <div className="widget widget_archive">
                                    <h3 className="widget-title">
                                        Archives
                                    </h3>

                                    <ul>
                                        <li><Link to="#">December 2018</Link></li>
                                        <li><Link to="#">January 2020</Link></li>
                                        <li><Link to="#">February 2020</Link></li>
                                        <li><Link to="#">March 2020</Link></li>
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        );
    }
}

export default EventDetail;